/**
 * @ngdoc directive
 * @name faTouchmove
 * @module famous.angular
 * @restrict A
 * @param {expression} faTouchmove Expression to evaluate upon touchmove. (Event object is available as `$event`)
 * @description
 * This directive allows you to specify custom behavior when an element is {@link https://developer.mozilla.org/en-US/docs/Web/Reference/Events/touchmove moved along a touch surface}.
 *
 * @usage
 * ```html
 * <ANY fa-touchmove="expression">
 *
 * </ANY>
 * ```
 *
 * Note:  For development purposes, enable mobile emulation: https://developer.chrome.com/devtools/docs/mobile-emulation
 * 
 * @example
 * Upon a touchmove event firing, `fa-touchmove` will evaluate the expression bound to it.
 * 
 * touchmove fires once upon first touch; touchmove fires as the touch point (finger) is moved along a touch surface, until release of the touch point.
 * The rate of which touchmove events fire is implementation-defined by browser and hardware.
 * `fa-touchmove` evaluates the expression bound to it upon each firing of touchmove.
 *
 * ### Fa-touchmove on an fa-surface
 * `Fa-touchmove`can be used on an `fa-surface`.  Internally, a Famous Surface has a `.on()` method that binds a callback function to an event type handled by that Surface.
 *  The function expression bound to `fa-touchmove` is bound to that `fa-surface`'s touchmove eventHandler, and when touchmove fires, the function expression will be called. 
 *
 <example module="faTouchMoveExampleApp">
  <file name="index.html">
  <fa-app ng-controller="TouchMoveCtrl">
      <fa-modifier fa-size="[200, 100]">
        <fa-surface fa-touchmove="touchMove($event)"
                    fa-background-color="'red'">
          Touch move count: {{touchMoveCount}}
        </fa-surface>
      </fa-modifier>
    </fa-app>

    <script>
      angular.module('faTouchMoveExampleApp', ['famous.angular'])
        .controller('TouchMoveCtrl', ['$scope', '$famous', function($scope, $famous) {
            
            $scope.touchMoveCount = 0;

            $scope.touchMove = function($event) {
              console.log($event);
              $scope.touchMoveCount++;
            };

        }]);
    </script>
  </file>
  <file name="style.css">
  fa-app {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  </file>
 </example>
 *
 *
 * ### Fa-touchmove on an fa-view
 * `Fa-touchmove` may be used on an `fa-view`.  The function expression bound to `fa-touchmove` will be bound to the `fa-view`'s internal `_eventInput`, the aggregation point of all events received by the `fa-view`.  When it receives a `touchmove` event, it will call the function expression bound to `fa-touchmove`.
 *  
 * In the example below, the `fa-surface` pipes its Surface events to an instantied Famous Event Handler called `myEvents`.
 * `Fa-view` pipes from `myEvents`, receiving all events piped by the `fa-surface`.
 * 
 * When a touchmove event occurs on the `fa-surface`, it is piped to the `fa-view`.  
 * `fa-touchmove` defines a callback function in which to handle touchmove events, and when it receives a touchmove event, it calls `touchMove()`. 
 *
 <example module="faTouchMoveExampleApp">
  <file name="index.html">
  <fa-app ng-controller="TouchMoveCtrl">

      <!-- The fa-view receives the touchmove event from the fa-surface, and calls $scope.touchMove, which is bound to fa-touchmove on the fa-view. -->

      <fa-view fa-touchmove="touchMove($event)" fa-pipe-from="myEvents">
        <fa-modifier fa-size="[200, 100]">
          <fa-surface fa-pipe-to="myEvents"
                      fa-background-color="'orange'">
            Touch move count: {{touchMoveCount}}
          </fa-surface>
        </fa-modifier>
      </fa-view>
    </fa-app>

    <script>
      angular.module('faTouchMoveExampleApp', ['famous.angular'])
        .controller('TouchMoveCtrl', ['$scope', '$famous', function($scope, $famous) {
            
            var EventHandler = $famous['famous/core/EventHandler'];
            $scope.myEvents = new EventHandler();

            $scope.touchMoveCount = 0;
            
            $scope.touchMove = function($event) {
              console.log($event);
              $scope.touchMoveCount++;
            };

        }]);
    </script>
  </file>
  <file name="style.css">
  fa-app {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  </file>
 </example>
 *
 */

angular.module('famous.angular')
  .directive('faTouchmove', ['$parse', '$famousDecorator', function ($parse, $famousDecorator) {
    return {
      restrict: 'A',
      scope: false,
      compile: function() {
        return { 
          post: function(scope, element, attrs) {
            var isolate = $famousDecorator.ensureIsolate(scope);

            if (attrs.faTouchmove) {
              var renderNode = (isolate.renderNode._eventInput || isolate.renderNode);

              renderNode.on("touchmove", function(data) {
                var fn = $parse(attrs.faTouchmove);
                fn(scope, {$event:data});
                if(!scope.$$phase)
                  scope.$apply();
              });
            }
          }
        };
      }
    };
  }]);
