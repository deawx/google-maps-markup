import Ember from 'ember';
import { v1 } from 'ember-uuid';
import layout from './template';
import overlayToFeature from '../../utils/overlay-to-feature';
import MODE from '../../utils/modes';
import featureCenter from '../../utils/feature-center';
import DRAWING_MODE from '../../utils/drawing-modes';
import initMeasureLabel from '../../utils/init-measure-label';
import MapLabel from '../../utils/map-label';
import DynamicLabel from '../../utils/dynamic-label';
import labelPlotter from '../../utils/label-plotter';

if (!window.google) {
  throw new Error('Sorry, but `google` defined globally is required for this addon');
}

const {
  on,
  run,
  set,
  inject,
  computed,
  A: boundArray,
  observer: observes
} = Ember;
const clearAllConfirm = 'Clearing results will persist the changes, if you want to save a copy of the results please copy the url before clearing the markup.';

export default Ember.Component.extend({
  // Start Attrs
  editable: true,
  panForOffscreen: true,
  autoResetToPan: false,
  map: computed.alias('markupData.map'),
  // End Attrs

  layout: layout,
  markupData: inject.service(),
  classNames: ['knownasilya--google-maps-markup'],
  dataLayers: computed.alias('markupData.layers'),
  results: computed.alias('markupData.results'),
  mode: computed.alias('markupData.mode'),
  textGeoJson: computed.alias('markupData.textGeoJson'),
  dm: new google.maps.drawing.DrawingManager({
    drawingControl: false
  }),
  listeners: boundArray(),
  toolListeners: boundArray(),
  currentPoints: boundArray(),
  currentLabel: new MapLabel(undefined, {
    dontScale: true
  }),
  resultsHidden: false,
  activeLayer: undefined,
  drawingMode: DRAWING_MODE.pan.id,
  modes: [
    MODE.draw,
    MODE.measure
  ],
  drawingModes: boundArray([
    DRAWING_MODE.pan,
    DRAWING_MODE.text,
    DRAWING_MODE.marker,
    DRAWING_MODE.polyline,
    DRAWING_MODE.circle,
    DRAWING_MODE.rectangle,
    DRAWING_MODE.polygon
  ]),
  measureModes: boundArray([
    DRAWING_MODE.pan,
    DRAWING_MODE.polyline,
    DRAWING_MODE.circle,
    DRAWING_MODE.rectangle,
    DRAWING_MODE.polygon
  ]),

  initPopupEvents: on('init', function () {
    var editable = this.get('editable');

    if (editable) {
      let popup = new google.maps.InfoWindow();

      popup.setContent(`<div id='google-maps-markup-infowindow'></div>`);

      popup.addListener('closeclick', run.bind(this, function () {
        Ember.set(popup, 'lastData.editing', false);
        Ember.set(popup, 'lastData', undefined);
        // cleanup?
      }));

      this.set('markupEditPopup', popup);
    }
  }),

  getTool(id, mode) {
    var toolIds = mode ? this.get((mode === 'draw' ? 'drawing' : mode) + 'Modes') : DRAWING_MODE;
    return Array.isArray(toolIds) ? toolIds.findBy('id', id) : toolIds[id];
  },

  addTextLabel(tool, position) {
    let autoResetToPan = this.get('autoResetToPan');
    let results = this.get('results');
    let mode = this.get('mode');
    let map = this.get('map');
    let style = Ember.copy(tool.style);
    let labelMarker = new DynamicLabel(position, {
      color: style.color,
      autoFocus: true
    });
    let item = {
      mode,
      style,
      isVisible: true,
      type: tool.id,
      feature: labelMarker
    };

    labelMarker.setMap(map);
    results.pushObject(item);
    map.setOptions({ draggableCursor: undefined });
    // TODO: convert to geojson and add to active layer
    // later load during results process
    let feature = this.markerToFeature(item, labelMarker);
    let textGeoJson = this.get('textGeoJson');

    feature.toGeoJson(data => {
      item.geojson = data;
      textGeoJson.pushObject(data);
    });

    if (autoResetToPan) {
      this.toolNotFinished = true;
      google.maps.event.addListenerOnce(labelMarker, 'focusout', () => {
        run.later(this, function () {
          let freshTool = this.getTool(tool.id);
          let freshStyle = Ember.copy(freshTool.style);

          labelMarker.color = freshStyle.color;
          item.style = freshStyle;
          item.geojson.properties.style = freshStyle;
          this.toolNotFinished = false;

          this.send('changeTool', DRAWING_MODE.pan.id);
        }, 250);
      });
    }

    this.set('drawFinished', true);
  },

  markerToFeature(result, marker) {
    var id = v1();
    var properties = {
      mode: result.mode,
      type: result.type,
      style: result.style,
      isVisible: true
    };
    var feature = new google.maps.Data.Feature({
      geometry: marker.position,
      properties,
      id
    });

    return feature;
  },

  actions: {
    updateOptionValue(tool, prop, value) {
      set(tool, prop, value);
    },

    changeMode(mode) {
      this.set('mode', mode.id);
    },

    changeTool(toolId) {
      var markupDataService = this.get('markupData');
      var activeLayer = this.get('activeLayer');
      var map = this.get('map');
      var dm = this.get('dm');
      var tool = this.getTool(toolId);
      var listeners = this.get('toolListeners');

      this.set('activeTool', tool);
      this.set('drawFinished', false);
      markupDataService.set('activeTool', tool.id);

      this.resetAllLayers();
      this.clearListeners();

      if (activeLayer) {
        if (tool.id === 'pan') {
          activeLayer.data.setDrawingMode(null);
          dm.setDrawingMode(null);

          let clickListener = activeLayer.data.addListener('click', event => {
            let results = this.get('results');
            let found = results.find(function (item) {
              return item.feature.getId() === event.feature.getId();
            });

            if (found.listItem) {
              found.listItem.send('edit', event.latLng);
            }
          });
          listeners.pushObject(clickListener);
        } else if (tool.id === 'text') {
          map.setOptions({ draggableCursor: 'crosshair' });
          let mapListener = map.addListener('click', event => {
            if (this.toolNotFinished) {
              return;
            }
            this.addTextLabel(tool, event.latLng);
            map.setOptions({ draggableCursor: 'default' });
            event.stop();
          });
          let dataListener = activeLayer.data.addListener('click', event => {
            this.addTextLabel(tool, event.latLng);
            map.setOptions({ draggableCursor: 'default' });
            event.stop();
          });
          listeners.pushObjects([ mapListener, dataListener ]);
        } else if (tool.dataId) {
          activeLayer.data.setDrawingMode(tool.dataId);
        } else if (tool.dmId) {
          dm.setDrawingMode(tool.dmId);
          dm.setMap(map);
        }
      }

      this.set('drawingMode', toolId);
    },

    toggleResults() {
      var isHidden = this.toggleProperty('resultsHidden');
      var activeLayer = this.get('activeLayer');
      var results = this.get('results');

      results.forEach(result => this.send('toggleResult', result, !isHidden));
      activeLayer.isHidden = isHidden;
    },

    clearResults() {
      if (confirm(clearAllConfirm)) {
        let mode = this.get('mode');
        let layer = this.get('activeLayer');
        let results = this.get('results');
        let textGeoJson = this.get('textGeoJson');

        layer.data.forEach((feature) => {
          layer.data.remove(feature);
        });

        results.forEach(result => {
          if (mode === 'measure') {
            result.label.onRemove();
          } else if (result.feature.setMap) {
            // remove text marker
            result.feature.setMap(null);
            if (result.type === 'text') {
              textGeoJson.removeObject(result.geojson);
            }
          }
        });

        results.clear();

        if (this.get('afterClearResults')) {
          this.sendAction('afterClearResults', layer);
        }
      }
    },

    removeResult(result) {
      var mode = this.get('mode');
      var results = this.get('results');
      var layer = this.get('activeLayer');
      var textGeoJson = this.get('textGeoJson');

      if (result.type === 'text') {
        result.feature.setMap(null);
        textGeoJson.removeObject(result.geojson);
      } else {
        layer.data.remove(result.feature);
      }

      if (mode === 'measure') {
        result.label.onRemove();
      }

      results.removeObject(result);
    },

    /**
     * Toggle show/hide of a result.
     *
     * @param {Object} result The result object to toggle.
     * @param {Boolean} force Override the toggle, true for show and false for hide.
     */
    toggleResult(result, force) {
      var layer = this.get('activeLayer');
      var mode = this.get('mode');
      var isMeasure = mode === 'measure';
      var hide = force !== undefined && force !== null ?
        !force :
        result.type === 'text' ? result.feature.visible : layer.data.contains(result.feature);

      if (hide) {
        Ember.set(result, 'isVisible', false);

        if (result.type === 'text') {
          result.feature.hide();
        } else {
          result.feature.setProperty('isVisible', false);
          layer.data.remove(result.feature);

          if (isMeasure) {
            result.label.hide();
          }
        }
      } else {
        Ember.set(result, 'isVisible', true);

        if (result.type === 'text') {
          result.feature.show();
        } else {
          result.feature.setProperty('isVisible', true);
          layer.data.add(result.feature);

          if (isMeasure) {
            result.label.show();
          }
        }
      }
    },

    editResult(data, wormhole, position) {
      var popup = this.get('markupEditPopup');
      var map = this.get('map');
      var editable = this.get('editable');

      if (!editable) {
        return;
      }

      if (popup.getPosition()) {
        popup.close();

        if (popup.lastData) {
          Ember.set(popup, 'lastData.editing', false);
        }
      }

      if (data) {
        let geometry = data.feature.getGeometry ? data.feature.getGeometry() : data.feature.position;
        let latlng = position && position instanceof google.maps.LatLng ? position : featureCenter(data.feature);

        if (geometry.getType && geometry.getType() === 'Point') {
          popup.setOptions({
            pixelOffset: new google.maps.Size(0, -40)
          });
        } else {
          popup.setOptions({
            pixelOffset: new google.maps.Size(0, 0)
          });
        }

        popup.setPosition(latlng);
        popup.open(map);
        popup.lastData = data;
        Ember.set(data, 'editing', true);

        // see routable-site template for wormhole/infowindow layout
        if (wormhole && !wormhole.isDestroying && !wormhole.isDestroyed) {
          wormhole.rerender();
        }
      }
    },

    highlightResult(data) {
      var layer = this.get('activeLayer');
      var style;

      this.panToIfHidden(data.feature);

      if (data.type === 'marker') {
        style = {
          icon: {
            url: 'google-maps-markup/images/spotlight-poi-highlighted_hdpi.png',
            scaledSize: new google.maps.Size(22, 40)
          }
        };
      } else if (data.type === 'text') {
        data.feature.highlight();
      } else {
        style = {
          strokeColor: 'red'
        };
      }

      if (data.label) {
        data.label.highlight();
      }

      layer.data.overrideStyle(data.feature, style);
    },

    resetResultStyle(data) {
      var layer = this.get('activeLayer');

      if (!data.editingShape) {
        if (data.type === 'text') {
          data.feature.clearHighlight();
        } else {
          layer.data.revertStyle(data.feature);
          if (data.style) {
            layer.data.overrideStyle(data.feature, data.style);
          }

          if (data.label) {
            data.label.clearHighlight();
          }
        }
      }

      if (!data.editing) {
        this.panBack();
      }
    }
  },

  resetAllLayers() {
    var layers = this.get('dataLayers');

    layers.forEach(layer => {
      layer.data.setDrawingMode(null);
    });
  },

  clearListeners() {
    var listeners = this.get('toolListeners');

    listeners.forEach(l => google.maps.event.removeListener(l));
    listeners.clear();
  },

  panToIfHidden(feature) {
    var panForOffscreen = this.get('panForOffscreen');

    if (!panForOffscreen) {
      return;
    }

    let map = this.get('map');
    let center = featureCenter(feature);
    let bounds = map.getBounds();

    if (!center) {
      return;
    }

    this.set('originalCenter', map.getCenter());

    if (!bounds.contains(center)) {
      map.panTo(center);
    }
  },

  panBack() {
    var panForOffscreen = this.get('panForOffscreen');

    if (!panForOffscreen) {
      return;
    }

    var map = this.get('map');
    var center = this.get('originalCenter');

    if (center) {
      map.setCenter(center);
    }
  },

  changeLayer: on('init', observes('mode', 'map', function () {
    var modeId = this.get('mode');
    var map = this.get('map');
    var drawingModeId = this.get('drawingMode');
    var dataLayers = this.get('dataLayers');
    var activeLayer = this.get('activeLayer');

    this.set('lastActiveLayer', activeLayer);

    if (modeId === MODE.draw.id || modeId === MODE.measure.id) {
      let tool = this.getTool(drawingModeId, modeId);

      activeLayer = dataLayers[modeId === MODE.draw.id ? 0 : 1];

      if (!activeLayer.isHidden) {
        activeLayer.data.setMap(map);
      }

      // tool doesn't exist for this mode, revert to pan
      if (!tool) {
        this.send('changeTool', DRAWING_MODE.pan.id);
      }

      activeLayer.data.setDrawingMode(tool && tool.dataId);

      this.set('activeLayer', activeLayer);
    }
  })),

  activeLayerSetup: observes('activeLayer', function () {
    var mode = this.get('mode');
    var layer = this.get('activeLayer');
    var lastLayer = this.get('lastActiveLayer');

    if (!layer) {
      return;
    }

    if (lastLayer) {
      google.maps.event.clearListeners(lastLayer.data, 'addfeature');
    }

    var listener = layer.data.addListener('addfeature', run.bind(this, (event) => {
      if (event.feature.getProperty('skip')) {
        return;
      }

      let map = this.get('map');
      let tool = this.get('activeTool');
      let drawingMode = this.get('drawingMode');
      let results = this.get('results');
      let found = results.find(function (item) {
        if (item.feature && item.feature.getId) {
          return item.feature.getId() === event.feature.getId();
        } else if (item.feature) {
          return item.feature === event.feature;
        }
      });

      if (!found) {
        let style = Ember.copy(tool.style);
        event.feature.setProperty('mode', mode);
        event.feature.setProperty('type', drawingMode);
        event.feature.setProperty('isVisible', true);
        event.feature.setProperty('style', style);

        let item = {
          mode,
          layer,
          style,
          isVisible: true,
          type: drawingMode,
          feature: event.feature
        };

        if (item.style) {
          layer.data.overrideStyle(event.feature, item.style);
        }

        initMeasureLabel(item, map);
        results.pushObject(item);

        if (this.get('afterAddFeature')) {
          this.sendAction('afterAddFeature', item);
        }

        let autoResetToPan = this.get('autoResetToPan');

        if (autoResetToPan) {
          run.later(this, function () {
            this.send('changeTool', DRAWING_MODE.pan.id);
          }, 250);
        }

        this.set('drawFinished', true);
      }
    }));

    this.get('listeners').pushObjects([
      listener
    ]);
  }),

  setup: on('didInsertElement', function () {
    var dm = this.get('dm');
    var results = this.get('results');
    var layers = this.get('dataLayers');
    var map = this.get('map');

    if (!this.get('mode')) {
      this.set('mode', MODE.draw.id);
    }

    // Enable all layers to show on map
    layers.forEach(layer => layer.data.setMap(map));

    let listener = dm.addListener('overlaycomplete', run.bind(this, (event) => {
      var activeLayer = this.get('activeLayer');
      var feature = overlayToFeature(event.type, event.overlay, results);

      event.overlay.setMap(null);

      activeLayer.data.add(feature);
    }));

    this.get('listeners').pushObject(listener);
  }),

  setupMapEvents: on('init', observes('isVisible', 'map', function () {
    var map = this.get('map');
    var isVisible = this.get('isVisible');
    var currentPoints = this.get('currentPoints');
    var currentLabel = this.get('currentLabel');

    if (map && isVisible) {
      let $body = Ember.$('body');
      let plotter;

      var onClick = run.bind(this, (event) => {
        var tool = this.get('drawingMode');
        var mode = this.get('mode');

        if (mode === 'draw') {
          return;
        }

        var mapDiv = map.getDiv();
        var target = event.target;
        var withinMap = mapDiv.contains(target);
        var toolIsPan = tool === 'pan';
        var drawFinished = this.get('drawFinished');
        var noPoints = !currentPoints.get('length');

        if (noPoints && drawFinished) {
          return;
        }

        if (withinMap && noPoints && !drawFinished) {
          let latlng = calculateLatLng(map, event);
          currentPoints.push(latlng);
          plotter = labelPlotter(currentLabel, currentPoints, tool, event, map);
        } else if (withinMap && !toolIsPan && !drawFinished) {
          let latlng = calculateLatLng(map, event);
          currentPoints.push(latlng);
        } else if (plotter && drawFinished) {
          plotter.finish();
          plotter = undefined;
        }
      });

      var onDblClick = run.bind(this, (event) => {
        if (plotter) {
          plotter.finish();
          plotter = undefined;
        }
        event.stopPropagation();
        event.preventDefault();
      });

      var onMouseMove = run.bind(this, (event) => {
        if (plotter) {
          let latlng = calculateLatLng(map, event);
          plotter.update(currentPoints.concat(latlng));
        }
      });

      // Setup raw click handling - workaround for no basic events for drawing
      $body.on('click', onClick);
      $body.on('dblclick', onDblClick);
      $body.on('mousemove', onMouseMove);

      this.set('bodyListeners', [
        { event: 'click', handler: onClick },
        { event: 'dblclick', handler: onDblClick },
        { event: 'mousemove', handler: onMouseMove }
      ]);
    }
  })),

  teardown: on('willDestroyElement', function () {
    var listeners = this.get('listeners');
    var bodyListeners = this.get('bodyListeners');

    this.send('changeTool', DRAWING_MODE.pan.id);

    // Cleanup all listeners
    if (listeners) {
      listeners.forEach(listener => {
        google.maps.event.removeListener(listener);
      });
    }

    if (bodyListeners) {
      let $body = Ember.$('body');

      bodyListeners.forEach(listener => {
        $body.off(listener.event, listener.handler);
      });
    }
  })
});

function calculatePosition(mapPosition, event) {
  var mapLeft = mapPosition.left;
  var mapTop = mapPosition.top;
  var x = event.pageX;
  var y = event.pageY;

  return {
    x: x - mapLeft,
    y: y - mapTop
  };
}

function calculateLatLng(map, event) {
  let $map = Ember.$(map.getDiv());
  let projection = map.getProjection();
  let bounds = map.getBounds();
  let ne = bounds.getNorthEast();
  let sw = bounds.getSouthWest();
  let topRight = projection.fromLatLngToPoint(ne);
  let bottomLeft = projection.fromLatLngToPoint(sw);
  let mapPosition = $map.offset();
  let pos = calculatePosition(mapPosition, event);
  let scale = 1 << map.getZoom();
  let point = new google.maps.Point(pos.x / scale + bottomLeft.x, pos.y / scale + topRight.y);
  let latlng = projection.fromPointToLatLng(point);

  return latlng;
}
