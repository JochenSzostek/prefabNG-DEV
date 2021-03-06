/*!
 * Created by prefabSOFT with JetBrains WebStorm.
 * User: Jochen Szostek
 * Date: 2/27/13
 * Time: 11:50 PM
 * Copyright (C) 2013 Jochen Szostek
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
'use strict';
angular.module('euTree.directive', [])
	.directive('treeElement', function ($compile) {
		return {
			restrict:'E', //Element
			link:function (scope, element, attrs) {
				console.debug('scope.tree: ',scope.tree);
				console.debug('scope.node: ',scope.node);
				scope.tree = scope.node;

				var visibility = ( attrs.nodeState != "collapse" ) || 'style="display: none;"';

				if (scope.tree.children.length) {
					for (var i in scope.tree.children) {
						if (scope.tree.children[i].children.length) {
							scope.tree.children[i].className = "eu_" + attrs.nodeState + " eu_deselected";
						}
						else {
							scope.tree.children[i].className = "eu_child" + " eu_deselected";
						}
					}

					var template = angular.element('<ul ' + visibility + '>' +
						'<li ng-repeat="node in tree.children" node-id={{node.' + attrs.nodeId + '}} ng-class="node.className">' +
							'{{node.' + attrs.nodeName + '}}' +
							'<tree-element tree="node" node-id=' + attrs.nodeId + ' node-name=' + attrs.nodeName + ' node-state=' + attrs.nodeState + '></tree-element>' +
						'</li>' +
					'</ul>');

					var linkFunction = $compile(template);
					linkFunction(scope);
					element.replaceWith(template);
				}
				else {
					element.remove();
				}
			}
		};
	})
	.directive('euTree', function ($compile) {
		return {
			restrict:'E', //Element
			link:function (scope, element, attrs) {
				scope.selectedNode = null;

				//CSS for TREE
				var sheet = document.createElement('style');
				sheet.innerHTML =
					"eu-tree ul{margin:0;padding:0;list-style:none;border:none;overflow:hidden;text-decoration:none;color:#555}" +
						"eu-tree li{position:relative;padding:0 0 0 20px;font-size:13px;font-weight:initial;line-height:18px;cursor:pointer}" +
						"eu-tree .eu_expand{background:url(" + attrs.expandIcon + ") no-repeat}" +
						"eu-tree .eu_collapse{background:url(" + attrs.collapseIcon + ") no-repeat}" +
						"eu-tree .eu_child{background:url(" + attrs.childIcon + ") no-repeat}" +
						"eu-tree .eu_selected{font-weight:bold;}" +
						"eu-tree .hide{display:none;}" +
						"eu-tree .eu_deselected{font-weight:normal;}";
				document.body.appendChild(sheet);


				scope.$watch(attrs.treeData, function (val) {
					for (var i in scope[attrs.treeData]) {
						if (scope[attrs.treeData][i].children.length) {
							scope[attrs.treeData][i].className = "eu_" + attrs.nodeState + " eu_deselected";
						}
						else {
							scope[attrs.treeData][i].className = "eu_child" + " eu_deselected";
						}
					}

					var template = angular.element('<ul id="euTreeBrowser" class="filetree treeview-famfamfam treeview">' +
						'<li ng-repeat="node in ' + attrs.treeData + '" node-id={{node.' + attrs.nodeId + '}} ng-class="node.className">' +
							'{{node.' + attrs.nodeName + '}}' +
							'<tree-element tree="node" node-id=' + attrs.nodeId + ' node-name=' + attrs.nodeName + ' node-state=' + attrs.nodeState + '></tree-element>' +
						'</li>' +
					'</ul>');

					var linkFunction = $compile(template);
					linkFunction(scope);
					element.html(null).append(template);


					//Click Event
					angular.element(document.getElementById('euTreeBrowser')).unbind().bind('click', function (e) {
						if (angular.element(e.target).length) {
							scope.previousElement = scope.currentElement;

							scope.currentElement = angular.element(e.target);

							scope.$broadcast('nodeSelected', { selectedNode:scope.currentElement.attr('node-id') });

							if (scope.previousElement) {
								scope.previousElement.addClass("eu_deselected").removeClass("eu_selected");
							}
							scope.currentElement.addClass("eu_selected").removeClass("eu_deselected");

							if (scope.currentElement.children().length) {
								scope.currentElement.children().toggleClass("hide");
								//$(e.target).children().slideToggle("fast");

								scope.currentElement.toggleClass("eu_collapse");
								scope.currentElement.toggleClass("eu_expand");
							}
						}

					});


				}, true);
			}
		};
	});