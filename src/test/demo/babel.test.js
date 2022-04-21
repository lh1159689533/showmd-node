const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');

function test(code) {
  const ast = parse(code, {
    plugins: [
      "jsx",
      "typescript",
    ],
  });
  // console.log(ast);
  traverse(ast, {
    // enter(path) {
    //   // console.log('path.node.name:', path.node.name);
    //   // console.log('path.parent:', path.parentPath?.node);
    //   if (path.parentPath?.node && types.isJSXIdentifier(path.parentPath.node.name, { name: 'th' })) {
    //     console.dir(path.node);
    //   }
    // }
    // JSXIdentifier(path) {
    // },
    JSXText(path) {
      console.log(path?.node?.value);
    },
    // JSXElement(path) {
    //   // console.log(path);
    //   console.log(path.node.openingElement);
    //   if (types.isJSXIdentifier(path.node.openingElement, { name: 'th' })) {
    //     console.log(path);
    //   }
    // }
  });
}

const code = `<tr>
<th>业务类型</th>
<th align="center">组件类型</th>
<th align="right">type值</th>
<th align="left">原type值</th>
<th>原组件</th>
</tr>`;
// test(code);

const code1 = `<><tr>
<td>workflow</td>
<td align="center">WorkFlow</td>
<td align="right">datadev/workflow</td>
<td align="left">datadev/workflow</td>
<td>D3WorkFlow</td>
</tr>
<tr>
<td>shell</td>
<td align="center">TaskEditor</td>
<td align="right">datadev/task/shell</td>
<td align="left">datadev/shell/editor</td>
<td>TaskEditor</td>
</tr></>`;
test(code1);