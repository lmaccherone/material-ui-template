module.exports = {
###
  <Route path="/" component={Master}>
    <IndexRoute component={Home} />
    <Route path="home" component={Home} />
    <Redirect from="customization" to="/customization/themes" />
    <Route path="customization">
      <Route path="colors" component={Colors} />
      <Route path="themes" component={Themes} />
      <Route path="inline-styles" component={InlineStyles} />
    </Route>
    <Redirect from="page-types" to="/page-types/markdown" />
    <Route path="page-types">
      <Route path="highcharts" component={HighchartsPage} />
      <Route path="markdown" component={MarkdownPage} />
      <Route path="showcase" component={Showcase} />
    </Route>
  </Route>
###
  path: '/', component: Master, children: [
    component: Home, index: true
    name: "Customization", path: "customization", redirectTo: "/customization/themes", children: [
      name: "Colors", path: "colors", component: Colors
      name: "Themes", path: "themes", component: Themes
      name: "Inline Styles", path: "inline-styles", component: InlineStyles
    ]
    name: "Page Types", path: "page-types", children: [  # If redirectTo is missing, it will use the first child
      name: "Highcharts", path: "highcharts", component: HighchartsPage
      name: "Markdown", path: "markdown", component: MarkdownPage
      name: "Showcase", path: "showcase", component: Showcase
    ]
  ]
}