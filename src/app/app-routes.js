import _ from 'lodash'

import Master from './components/master'
import Home from './components/pages/home'

import Colors from './components/pages/customization/colors'
import Themes from './components/pages/customization/themes'
import InlineStyles from './components/pages/customization/inline-styles'

import HighchartsPage from './components/pages/page-types/highcharts'
import MarkdownPage from './components/pages/page-types/MarkdownPage'
import Showcase from './components/pages/page-types/Showcase'
import Blank from './components/pages/page-types/blank'
import Config from './components/pages/page-types/config'

import EventRate from './components/pages/pendo/EventRate'
import AnalysisDesigner from './components/pages/pendo/AnalysisDesigner'

let appRoutes = {
  path: '/', component: Master, hidden: true, indexRoute: {component: Home}, childRoutes: [
    {name: "Customization", path: "customization", redirectTo: "/customization/themes", childRoutes: [
      {name: "Colors", path: "colors", component: Colors},
      {name: "Themes", path: "themes", component: Themes},
      {name: "Inline Styles", path: "inline-styles", component: InlineStyles}
    ]},
    {name: "Page Types", path: "page-types", childRoutes: [
      {name: "Highcharts", path: "highcharts", component: HighchartsPage},
      {name: "Markdown", path: "markdown", component: MarkdownPage},
      {name: "Showcase", path: "showcase", component: Showcase},
      {name: "Blank", path: "blank", component: Blank},
      {name: "Config", path: "config", component: Config, config: {a:1}},
      {name: "Config 2", path: "config2", component: Config, config: {b:2}},
      {name: "Hidden", hidden: true, path: "hidden", component: Blank},
      {name: "3 Level Menu", path: "3-level", childRoutes: [
        {name: "Blank", path: "blank", component: Blank},
      ]},
    ]},
    {name: "Pendo", path: "pendo", redirectTo: "/pendo/event-rate", childRoutes: [
      {name: "Event Rate", path: "event-rate", component: EventRate},
      {name: "Analysis Designer", path: "analysis-designer", component: AnalysisDesigner},
    ]},
  ]
}

let expandAppRoutes = function(currentNode, parentFullPath = null) {
  if (parentFullPath) {
    if (_.endsWith(parentFullPath, '/')) {
      currentNode.fullPath = parentFullPath + currentNode.path
    } else {
      currentNode.fullPath = parentFullPath + '/' + currentNode.path
    }
  } else {
    currentNode.fullPath = currentNode.path
  }
  if (currentNode.childRoutes) {
    for (let child of currentNode.childRoutes) {
      expandAppRoutes(child, currentNode.fullPath)
    }
  }
}

expandAppRoutes(appRoutes)

export default appRoutes