const nodeActions = new Map();

function newNodeAction( action, ...nodes ) {
	for( const node of nodes ) {
		nodeActions.set( node, action );
	}
}

newNodeAction( node => node.body,
	"Program",
	"BlockStatement",
	"ClassBody" );

newNodeAction( node => [ node.id, ...node.params, node.body ], 
	"FunctionDeclaration",
	"FunctionExpression",
	"ArrowFunctionExpression" );

newNodeAction( node => [ node.expression ],
	"ExpressionStatement" );

newNodeAction( node => [ node.object, node.body ],
	"WithStatement" );

newNodeAction( node => [ node.argument ], 
	"ReturnStatement",
	"ThrowStatement",
	"UnaryExpression",
	"UpdateExpression",
	"SpreadElement",
	"YieldExpression",
	"RestElement",
	"AwaitExpression" );

newNodeAction( node => [ node.label, node.body ],
	"LabeledStatement" );

newNodeAction( node => [ node.label ], 
	"BreakStatement",
	"ContinueStatement" );

newNodeAction( node => [ node.test, node.consequent, node.alternate ], 
	"IfStatement",
	"ConditionalExpression" );

newNodeAction( node => [ node.test, ...node.consequent ],
	"SwitchCase" );

newNodeAction( node => [ node.discriminant, ...node.cases ],
	"SwitchStatement" );

newNodeAction( node => [ node.block, node.handler, node.finalizer ],
	"TryStatement" );

newNodeAction( node => [ node.param, node.body ],
	"CatchClause" );

newNodeAction( node => [ node.test, node.body ],
	"WhileStatement" );

newNodeAction( node => [ node.body, node.test ],
	"DoWhileStatement" );

newNodeAction( node => [ node.init, node.test, node.update, node.body ],
	"ForStatement" );

newNodeAction( node => [ node.left, node.right, node.body ], 
	"ForInStatement",
	"ForOfStatement" );

newNodeAction( node => [ node.id, node.init ],
	"VariableDeclarator" );

newNodeAction( node => node.declarations,
	"VariableDeclaration" );

newNodeAction( node => node.elements, 
	"ArrayExpression",
	"ArrayPattern" );

newNodeAction( node => [ node.key, node.value ], 
	"Property",
	"AssignmentProperty",
	"MethodDefinition" );

newNodeAction( node => node.properties, 
	"ObjectExpression",
	"ObjectPattern" );

newNodeAction( node => [ node.left, node.right ], 
	"BinaryExpression",
	"AssignmentExpression",
	"LogicalExpression" );

newNodeAction( node => [ node.object, node.property ],
	"MemberExpression" );

newNodeAction( node => [ node.callee, ...node.arguments ],
	"CallExpression" );

newNodeAction( node => node.expressions,
	"SequenceExpression" );

newNodeAction( node => [ ...node.quasis, ...node.expressions ],
	"TemplateLiteral" );

newNodeAction( node => [ node.id, node.superClass, node.body ], 
	"ClassDeclaration",
	"ClassExpression" );

newNodeAction( node => [ node.meta, node.property ],
	"MetaProperty" );

newNodeAction( node => [ node.local ], 
	"ImportSpecifier",
	"ImportDefaultSpecifier",
	"ImportNamespaceSpecifier" );

newNodeAction( node => [ ...node.specifiers, node.source ],
	"ImportDeclaration" );

newNodeAction( node => [ node.exported ],
	"ExportSpecifier" );

newNodeAction( node => [ node.declaration, ...node.specifiers, node.source ],
	"ExportNamedDeclaration" );

newNodeAction( node => [ node.declaration ],
	"ExportDefaultDeclaration" );

newNodeAction( node => [ node.source ],
	"ExportAllDeclaration" );

newNodeAction( node => [ node.left, node.right ],
	"AssignmentPattern" );

class Traveler {
	constructor( root ) {
		this.fringe = [ root ];
	}
	
	next() {
		if( this.fringe.length === 0 ) {
			return {
				done: true,
				value: undefined
			};
		}
		
		const currentNode = this.fringe.pop();
		
		const nodeAction = nodeActions.get( currentNode.type );
		
		if( nodeAction !== undefined ) {
			const childNodes = nodeAction( currentNode );
			
			let i = childNodes.length;
			
			while( i-- > 0 ) {
				const childNode = childNodes[ i ];
				if( childNode !== null ) {
					this.fringe.push( childNode );
				}
			}
		}
		
		return {
			done: false,
			value: currentNode
		};
	}
	
	[ Symbol.iterator ]() {
		return this;
	}
}

module.exports = Traveler;