通常，一个组件的子代（this.props.children）是一个组件的数组：
```js
var GenericWrapper = React.createClass({
  componentDidMount: function() {
    console.log(Array.isArray(this.props.children)); // => true
  },
  render: function() {
    return <div />;
  }
});
React.render(
  <GenericWrapper><span/><span/><span/></GenericWrapper>,
  mountNode
);
```  


然而，当只有一个子代的时候，this.props.children 将会变成一个单独的组件，而不是数组形式。这样就减少了数组的占用。

```js
var GenericWrapper = React.createClass({
  componentDidMount: function() {
    console.log(Array.isArray(this.props.children)); // => false

    // 注意：结果将是 5，而不是 1，因为 `this.props.children` 不是数组，而是 'hello' 字符串！
    console.log(this.props.children.length);
  },

  render: function() {
    return <div />;
  }
});

React.render(<GenericWrapper>hello</GenericWrapper>, mountNode);
```  


为了让处理 this.props.children 更简单，我们提供了 React.Children utilities。
