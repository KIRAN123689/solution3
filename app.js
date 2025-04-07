(function () {
    'use strict';
  
    angular.module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('foundItems', FoundItemsDirective);
  
    // Directive for showing found items
    function FoundItemsDirective() {
      return {
        restrict: 'E',
        template: `
          <ul>
            <li ng-repeat="item in items">
              {{ item.name }} ({{ item.short_name }}): {{ item.description }}
              <button ng-click="onRemove({ index: $index })">Don't want this one!</button>
            </li>
          </ul>
        `,
        scope: {
          items: '<',
          onRemove: '&'
        }
      };
    }
  
    // Controller
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var ctrl = this;
      ctrl.searchTerm = '';
      ctrl.found = [];
      ctrl.searched = false;
  
      ctrl.narrowItDown = function () {
        ctrl.searched = true;
  
        if (!ctrl.searchTerm.trim()) {
          ctrl.found = [];
          return;
        }
  
        MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
          .then(function (foundItems) {
            ctrl.found = foundItems;
          });
      };
  
      ctrl.removeItem = function (index) {
        ctrl.found.splice(index, 1);
      };
    }
  
    // Service
    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
      var service = this;
  
      service.getMatchedMenuItems = function (searchTerm) {
        return $http({
          method: 'GET',
          url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json'
        }).then(function (response) {
          var foundItems = [];
  
          var menuCategories = response.data;
          for (var category in menuCategories) {
            var items = menuCategories[category].menu_items;
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              if (item.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                foundItems.push(item);
              }
            }
          }
  
          return foundItems;
        });
      };
    }
  })();