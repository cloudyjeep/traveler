const Traveler = require( "../index" );

function verify( root, expectedNodeOrder ) {
	const programNode = {
		type: "Program",
		body: [
			root,
			{ type: "EmptyStatement" }
		]
	};
	
	const traveler = new Traveler( programNode );
	
	expectedNodeOrder = [ programNode, root ].concat( expectedNodeOrder );
	expectedNodeOrder.push( programNode.body[1] );
	
	const iterator = traveler[ Symbol.iterator ]();
	let iteratorResult = iterator.next();
	
	for( const node of expectedNodeOrder ) {
		if( iteratorResult.done ) {
			fail( "Returned fewer nodes than expected" );
			return;
		}
		expect( iteratorResult.value ).toBe( node );
		iteratorResult = iterator.next();
	}
	if( !iteratorResult.done ) {
		fail( "Returned more nodes than expected" );
		return;
	}
	expect( iteratorResult.value ).toBe( undefined );
}

describe( "Traveler", () => {
	it( "initializes", () => {
		const traveler = new Traveler( {
			type: "Program",
			body: []
		} );
	} );
	
	it( "implements iterator method", () => {
		expect( Traveler.prototype[Symbol.iterator] instanceof Function ).toBe( true );
	} );
	
	it( "returns only node", () => {
		const programNode = {
			type: "Program",
			body: []
		};
		
		const traveler = new Traveler( programNode );
		
		expect( traveler.next().value ).toBe( programNode );
		expect( traveler.next().done ).toBe( true );
	} );
	
	it( "returns children of Program", () => {
		const programNode = {
			type: "Program",
			body: [
				{ type: "EmptyStatement" },
				{ type: "EmptyStatement" }
			]
		};
		
		const traveler = new Traveler( programNode );
		
		expect( traveler.next().value ).toBe( programNode );
		expect( traveler.next().value ).toBe( programNode.body[0] );
		expect( traveler.next().value ).toBe( programNode.body[1] );
		expect( traveler.next().done ).toBe( true );
	} );
	
	it( "returns children of BlockStatement", () => {
		const root = {
			type: "BlockStatement",
			body: [
				{ type: "EmptyStatement" },
				{ type: "EmptyStatement" }
			]
		};
		
		verify( root, root.body );
	} );
	
	it( "returns children of FunctionDeclaration", () => {
		const root = {
			type: "FunctionDeclaration",
			id: { type: "Identifier" },
			params: [
				{ type: "Identifier" },
				{ type: "Identifier" }
			],
			body: {
				type: "BlockStatement",
				body: []
			}
		};
		
		verify( root, [ root.id, root.params[0], root.params[1], root.body ] );
	} );
	
	it( "returns children of FunctionExpression", () => {
		const root = {
			type: "FunctionExpression",
			id: null,
			params: [
				{ type: "Identifier" },
				{ type: "Identifier" }
			],
			body: {
				type: "BlockStatement",
				body: []
			}
		};
		
		verify( root, root.params.concat( [ root.body ] ) );
	} );
	
	it( "returns children of ExpressionStatement", () => {
		const root = {
			type: "ExpressionStatement",
			expression: { type: "Literal" }
		};
		
		verify( root, [ root.expression ] );
	} );
	
	it( "returns children of WithStatement", () => {
		const root = {
			type: "WithStatement",
			object: { type: "Literal" },
			body: { type: "EmptyStatement" }
		};
		
		verify( root, [ root.object, root.body ] );
	} );
	
	it( "returns children of ReturnStatement", () => {
		const root = {
			type: "ReturnStatement",
			argument: { type: "Literal" }
		};
		
		verify( root, [ root.argument ] );
	} );
	
	it( "returns children of LabeledStatement", () => {
		const root = {
			type: "LabeledStatement",
			label: { type: "Identifier" },
			body: { type: "EmptyStatement" }
		};
		
		verify( root, [ root.label, root.body ] );
	} );
	
	it( "returns children of BreakStatement", () => {
		const root = {
			type: "BreakStatement",
			label: { type: "Identifier" }
		};
		
		verify( root, [ root.label ] );
	} );
	
	it( "returns children of BreakStatement with no label", () => {
		const root = {
			type: "BreakStatement",
			label: null
		};
		
		verify( root, [] );
	} );
	
	it( "returns children of ContinueStatement", () => {
		const root = {
			type: "ContinueStatement",
			label: { type: "Identifier" }
		};
		
		verify( root, [ root.label ] );
	} );
	
	it( "returns children of ContinueStatement with no label", () => {
		const root = {
			type: "ContinueStatement",
			label: null
		};
		
		verify( root, [] );
	} );
	
	it( "returns children of IfStatement", () => {
		const root = {
			type: "IfStatement",
			test: { type: "Literal" },
			consequent: { type: "EmptyStatement" },
			alternate: { type: "EmptyStatement" }
		};
		
		verify( root, [ root.test, root.consequent, root.alternate ] );
	} );
	
	it( "returns children of IfStatement with no alternate", () => {
		const root = {
			type: "IfStatement",
			test: { type: "Literal" },
			consequent: { type: "EmptyStatement" },
			alternate: null
		};
		
		verify( root, [ root.test, root.consequent ] );
	} );
	
	it( "returns children of SwitchCase", () => {
		const root = {
			type: "SwitchCase",
			test: { type: "Literal" },
			consequent: [
				{ type: "EmptyStatement" },
				{ type: "EmptyStatement" }
			]
		};
		
		verify( root, [ root.test, root.consequent[0], root.consequent[1] ] );
	} );
	
	it( "returns children of SwitchCase with no test", () => {
		const root = {
			type: "SwitchCase",
			test: null,
			consequent: [
				{ type: "EmptyStatement" },
				{ type: "EmptyStatement" }
			]
		};
		
		verify( root, [ root.consequent[0], root.consequent[1] ] );
	} );
	
	it( "returns children of SwitchStatement", () => {
		const root = {
			type: "SwitchStatement",
			discriminant: { type: "Literal" },
			cases: [
				{
					type: "SwitchCase",
					test: null,
					consequent: []
				},
				{
					type: "SwitchCase",
					test: null,
					consequent: []
				}
			]
		};
		
		verify( root, [ root.discriminant, root.cases[0], root.cases[1] ] );
	} );
	
	it( "returns children of ThrowStatement", () => {
		const root = {
			type: "ThrowStatement",
			argument: {
				type: "Literal",
				value: null
			}
		};
		
		verify( root, [ root.argument ] );
	} );
	
	it( "returns children of CatchClause", () => {
		const root = {
			type: "CatchClause",
			param: { type: "Identifier" },
			body: {
				type: "BlockStatement",
				body: []
			}
		};
		
		verify( root, [ root.param, root.body ] );
	} );
	
	it( "returns children of TryStatement", () => {
		const root = {
			type: "TryStatement",
			block: {
				type: "BlockStatement",
				body: []
			},
			handler: {
				type: "CatchClause",
				param: { type: "Identifier" },
				body: {
					type: "BlockStatement",
					body: []
				}
			},
			finalizer: {
				type: "BlockStatement",
				body: []
			}
		};
		
		verify( root, [ root.block, root.handler, root.handler.param, root.handler.body, root.finalizer ] );
	} );
	
	it( "returns children of TryStatement with no finalizer", () => {
		const root = {
			type: "TryStatement",
			block: {
				type: "BlockStatement",
				body: []
			},
			handler: {
				type: "CatchClause",
				param: { type: "Identifier" },
				body: {
					type: "BlockStatement",
					body: []
				}
			},
			finalizer: null
		};
		
		verify( root, [ root.block, root.handler, root.handler.param, root.handler.body ] );
	} );
	
	it( "returns children of TryStatement with no handler", () => {
		const root = {
			type: "TryStatement",
			block: {
				type: "BlockStatement",
				body: []
			},
			handler: null,
			finalizer: {
				type: "BlockStatement",
				body: []
			}
		};
		
		verify( root, [ root.block, root.finalizer ] );
	} );
	
	it( "returns children of VariableDeclarator", () => {
		const root = {
			type: "VariableDeclarator",
			id: { type: "Identifier" },
			init: { type: "Literal" }
		};
		
		verify( root, [ root.id, root.init ] );
	} );
	
	it( "returns children of VariableDeclarator with no initializer", () => {
		const root = {
			type: "VariableDeclarator",
			id: { type: "Identifier" },
			init: null
		};
		
		verify( root, [ root.id ] );
	} );
	
	it( "returns children of VariableDeclaration", () => {
		const root = {
			type: "VariableDeclaration",
			declarations: [
				{
					type: "VariableDeclarator",
					id: { type: "Identifier" },
					init: null
				},
				{
					type: "VariableDeclarator",
					id: { type: "Identifier" },
					init: null
				}
			]
		};
		
		verify( root, [ root.declarations[0], root.declarations[0].id, root.declarations[1], root.declarations[1].id ] );
	} );
	
	it( "returns children of WhileStatement", () => {
		const root = {
			type: "WhileStatement",
			test: { type: "Literal" },
			body: { type: "EmptyStatement" }
		};
		
		verify( root, [ root.test, root.body ] );
	} );
	
	it( "returns children of DoWhileStatement", () => {
		const root = {
			type: "DoWhileStatement",
			body: { type: "EmptyStatement" },
			test: { type: "Literal" }
		};
		
		verify( root, [ root.body, root.test ] );
	} );
	
	it( "returns children of ForStatement", () => {
		const root = {
			type: "ForStatement",
			init: { type: "Literal" },
			test: { type: "Literal" },
			update: { type: "Literal" },
			body: { type: "EmptyStatement" }
		};
		
		verify( root, [ root.init, root.test, root.update, root.body ] );
	} );
	
	it( "returns children of ForStatement with no initialization", () => {
		const root = {
			type: "ForStatement",
			init: null,
			test: { type: "Literal" },
			update: { type: "Literal" },
			body: { type: "EmptyStatement" }
		};
		
		verify( root, [ root.test, root.update, root.body ] );
	} );
	
	it( "returns children of ForStatement with no test", () => {
		const root = {
			type: "ForStatement",
			init: { type: "Literal" },
			test: null,
			update: { type: "Literal" },
			body: { type: "EmptyStatement" }
		};
		
		verify( root, [ root.init, root.update, root.body ] );
	} );
	
	it( "returns children of ForStatement with no update operations", () => {
		const root = {
			type: "ForStatement",
			init: { type: "Literal" },
			test: { type: "Literal" },
			update: null,
			body: { type: "EmptyStatement" }
		};
		
		verify( root, [ root.init, root.test, root.body ] );
	} );
	
	it( "returns children of ForStatement with no paramaters", () => {
		const root = {
			type: "ForStatement",
			init: null,
			test: null,
			update: null,
			body: { type: "EmptyStatement" }
		};
		
		verify( root, [ root.body ] );
	} );
	
	it( "returns children of ForInStatement", () => {
		const root = {
			type: "ForInStatement",
			left: { type: "Identifier" },
			right: { type: "Identifier" },
			body: { type: "EmptyStatement" }
		};
		
		verify( root, [ root.left, root.right, root.body ] );
	} );
	
	it( "returns children of ForOfStatement", () => {
		const root = {
			type: "ForOfStatement",
			left: { type: "Identifier" },
			right: { type: "Identifier" },
			body: { type: "EmptyStatement" }
		};
		
		verify( root, [ root.left, root.right, root.body ] );
	} );
	
	it( "returns children of ArrayExpression", () => {
		const root = {
			type: "ArrayExpression",
			elements: [
				{ type: "Literal" },
				null,
				{ type: "Literal" }
			]
		};
		
		verify( root, [ root.elements[0], root.elements[2] ] );
	} );
	
	it( "returns children of Property", () => {
		const root = {
			type: "Property",
			key: { type: "Identifier" },
			value: { type: "Literal" }
		};
		
		verify( root, [ root.key, root.value ] );
	} );
	
	it( "returns children of AssignmentProperty", () => {
		const root = {
			type: "AssignmentProperty",
			key: { type: "Identifier" },
			value: { type: "Identifier" }
		};
		
		verify( root, [ root.key, root.value ] );
	} );
	
	it( "returns children of ObjectExpression", () => {
		const root = {
			type: "ObjectExpression",
			properties: [
				{
					type: "Property",
					key: { type: "Identifier" },
					value: { type: "Literal" }
				},
				{
					type: "Property",
					key: { type: "Identifier" },
					value: { type: "Literal" }
				}
			]
		};
		
		verify( root, [ root.properties[0], root.properties[0].key, root.properties[0].value, root.properties[1], root.properties[1].key, root.properties[1].value ] );
	} );
	
	it( "returns children of UpdateExpression", () => {
		const root = {
			type: "UpdateExpression",
			argument: { type: "Literal" }
		};
		
		verify( root, [ root.argument ] );
	} );
	
	it( "returns children of UnaryExpression", () => {
		const root = {
			type: "UnaryExpression",
			argument: { type: "Literal" }
		};
		
		verify( root, [ root.argument ] );
	} );
	
	it( "returns children of BinaryExpression", () => {
		const root = {
			type: "BinaryExpression",
			left: { type: "Literal" },
			right: { type: "Literal" }
		};
		
		verify( root, [ root.left, root.right ] );
	} );
	
	it( "returns children of AssignmentExpression", () => {
		const root = {
			type: "AssignmentExpression",
			left: { type: "Literal" },
			right: { type: "Literal" }
		};
		
		verify( root, [ root.left, root.right ] );
	} );
	
	it( "returns children of LogicalExpression", () => {
		const root = {
			type: "LogicalExpression",
			left: { type: "Literal" },
			right: { type: "Literal" }
		};
		
		verify( root, [ root.left, root.right ] );
	} );
	
	it( "returns children of MemberExpression", () => {
		const root = {
			type: "MemberExpression",
			object: { type: "Literal" },
			property: { type: "Literal" }
		};
		
		verify( root, [ root.object, root.property ] );
	} );
	
	it( "returns children of ConditionalExpression", () => {
		const root = {
			type: "ConditionalExpression",
			test: { type: "Literal" },
			consequent: { type: "EmptyStatement" },
			alternate: { type: "EmptyStatement" }
		};
		
		verify( root, [ root.test, root.consequent, root.alternate ] );
	} );
	
	it( "returns children of CallExpression", () => {
		const root = {
			type: "CallExpression",
			callee: { type: "Identifier" },
			arguments: [
				{ type: "Identifier" },
				{ type: "Identifier" }
			]
		};
		
		verify( root, [ root.callee, root.arguments[0], root.arguments[1] ] );
	} );
	
	it( "returns children of SequenceExpression", () => {
		const root = {
			type: "SequenceExpression",
			expressions: [
				{ type: "Identifier" },
				{ type: "Identifier" }
			]
		};
		
		verify( root, root.expressions );
	} );
	
	it( "returns children of SpreadElement", () => {
		const root = {
			type: "SpreadElement",
			argument: { type: "Identifier" }
		};
		
		verify( root, [ root.argument ] );
	} );
	
	it( "returns children of ArrowFunctionExpression", () => {
		const root = {
			type: "ArrowFunctionExpression",
			id: null,
			params: [
				{ type: "Identifier" },
				{ type: "Identifier" }
			],
			body: { type: "Literal" }
		};
		
		verify( root, [ root.params[0], root.params[1], root.body ] );
	} );
	
	it( "returns children of YieldExpression", () => {
		const root = {
			type: "YieldExpression",
			argument: { type: "Literal" }
		};
		
		verify( root, [ root.argument ] );
	} );
	
	it( "returns children of YieldExpression with no argument", () => {
		const root = {
			type: "YieldExpression",
			argument: null
		};
		
		verify( root, [] );
	} );
	
	it( "returns children of TemplateLiteral", () => {
		const root = {
			type: "TemplateLiteral",
			quasis: [
				{ type: "TemplateElement" },
				{ type: "TemplateElement" }
			],
			expressions: [
				{ type: "Literal" },
				{ type: "Literal" }
			]
		};
		
		verify( root, root.quasis.concat( root.expressions ) );
	} );
	
	it( "returns children of ObjectPattern", () => {
		const root = {
			type: "ObjectPattern",
			properties: [
				{
					type: "AssignmentProperty",
					key: { type: "Identifier" },
					value: { type: "Identifier" }
				},
				{
					type: "AssignmentProperty",
					key: { type: "Identifier" },
					value: { type: "Identifier" }
				}
			]
		};
		
		verify( root, [ root.properties[0], root.properties[0].key, root.properties[0].value, root.properties[1], root.properties[1].key, root.properties[1].value ] );
	} );
	
	it( "returns children of ArrayPattern", () => {
		const root = {
			type: "ArrayPattern",
			elements: [
				{ type: "Literal" },
				null,
				{ type: "Literal" }
			]
		};
		
		verify( root, [ root.elements[0], root.elements[2] ] );
	} );
	
	it( "returns children of RestElement", () => {
		const root = {
			type: "RestElement",
			argument: { type: "Identifier" }
		};
		
		verify( root, [ root.argument ] );
	} );
	
	it( "returns children of MethodDefinition", () => {
		const root = {
			type: "MethodDefinition",
			key: { type: "Literal" },
			value: {
				type: "FunctionExpression",
				id: null,
				params: [],
				body: {
					type: "BlockStatement",
					body: []
				}
			}
		};
		
		verify( root, [ root.key, root.value, root.value.body ] );
	} );
	
	it( "returns children of ClassBody", () => {
		const root = {
			type: "ClassBody",
			superClass: null,
			body: [
				{
					type: "MethodDefinition",
					key: { type: "Literal" },
					value: {
						type: "FunctionExpression",
						id: null,
						params: [],
						body: {
							type: "BlockStatement",
							body: []
						}
					}
				}
			]
		};
		
		verify( root, [ root.body[0], root.body[0].key, root.body[0].value, root.body[0].value.body ] );
	} );
	
	it( "returns children of ClassDeclaration", () => {
		const root = {
			type: "ClassDeclaration",
			id: { type: "Identifier" },
			superClass: { type: "Identifier" },
			body: {
				type: "ClassBody",
				superClass: null,
				body: [
					{
						type: "MethodDefinition",
						key: { type: "Literal" },
						value: {
							type: "FunctionExpression",
							id: null,
							params: [],
							body: {
								type: "BlockStatement",
								body: []
							}
						}
					}
				]
			}
		};
		
		verify( root, [ root.id, root.superClass, root.body, root.body.body[0], root.body.body[0].key, root.body.body[0].value, root.body.body[0].value.body ] );
	} );
	
	it( "returns children of ClassDeclaration with no super class", () => {
		const root = {
			type: "ClassDeclaration",
			id: { type: "Identifier" },
			superClass: null,
			body: {
				type: "ClassBody",
				superClass: null,
				body: [
					{
						type: "MethodDefinition",
						key: { type: "Literal" },
						value: {
							type: "FunctionExpression",
							id: null,
							params: [],
							body: {
								type: "BlockStatement",
								body: []
							}
						}
					}
				]
			}
		};
		
		verify( root, [ root.id, root.body, root.body.body[0], root.body.body[0].key, root.body.body[0].value, root.body.body[0].value.body ] );
	} );
	
	it( "returns children of ClassExpression", () => {
		const root = {
			type: "ClassExpression",
			id: null,
			superClass: { type: "Identifier" },
			body: {
				type: "ClassBody",
				superClass: null,
				body: [
					{
						type: "MethodDefinition",
						key: { type: "Literal" },
						value: {
							type: "FunctionExpression",
							id: null,
							params: [],
							body: {
								type: "BlockStatement",
								body: []
							}
						}
					}
				]
			}
		};
		
		verify( root, [ root.superClass, root.body, root.body.body[0], root.body.body[0].key, root.body.body[0].value, root.body.body[0].value.body ] );
	} );
	
	it( "returns children of ClassExpression with no super class", () => {
		const root = {
			type: "ClassExpression",
			id: null,
			superClass: null,
			body: {
				type: "ClassBody",
				superClass: null,
				body: [
					{
						type: "MethodDefinition",
						key: { type: "Literal" },
						value: {
							type: "FunctionExpression",
							id: null,
							params: [],
							body: {
								type: "BlockStatement",
								body: []
							}
						}
					}
				]
			}
		};
		
		verify( root, [ root.body, root.body.body[0], root.body.body[0].key, root.body.body[0].value, root.body.body[0].value.body ] );
	} );
	
	it( "returns children of MetaProperty", () => {
		const root = {
			type: "MetaProperty",
			meta: { type: "Identifier" },
			property: { type: "Identifier" }
		};
		
		verify( root, [ root.meta, root.property ] );
	} );
	
	it( "returns children of ImportSpecifier", () => {
		const root = {
			type: "ImportSpecifier",
			local: { type: "Identifier" }
		};
		
		verify( root, [ root.local ] );
	} );
	
	it( "returns children of ImportDefaultSpecifier", () => {
		const root = {
			type: "ImportDefaultSpecifier",
			local: { type: "Identifier" }
		};
		
		verify( root, [ root.local ] );
	} );
	
	it( "returns children of ImportNamespaceSpecifier", () => {
		const root = {
			type: "ImportNamespaceSpecifier",
			local: { type: "Identifier" }
		};
		
		verify( root, [ root.local ] );
	} );
	
	it( "returns children of ImportDeclaration", () => {
		const root = {
			type: "ImportDeclaration",
			specifiers: [
				{
					type: "ImportSpecifier",
					local: { type: "Identifier" }
				},
				{
					type: "ImportSpecifier",
					local: { type: "Identifier" }
				}
			],
			source: { type: "Literal" }
		};
		
		verify( root, [ root.specifiers[0], root.specifiers[0].local, root.specifiers[1], root.specifiers[1].local, root.source ] );
	} );
	
	it( "returns children of ExportSpecifier", () => {
		const root = {
			type: "ExportSpecifier",
			exported: { type: "Identifier" }
		};
		
		verify( root, [ root.exported ] );
	} );
	
	it( "returns children of ExportNamedDeclaration", () => {
		const root = {
			type: "ExportNamedDeclaration",
			declaration: {
				type: "FunctionDeclaration",
				id: { type: "Identifier" },
				params: [],
				body: {
					type: "BlockStatement",
					body: []
				}
			},
			specifiers: [
				{
					type: "ExportSpecifier",
					exported: { type: "Identifier" }
				}
			],
			source: { type: "Literal" }
		};
		
		verify( root, [ root.declaration, root.declaration.id, root.declaration.body, root.specifiers[0], root.specifiers[0].exported, root.source ] );
	} );
	
	it( "returns children of ExportDefaultDeclaration", () => {
		const root = {
			type: "ExportDefaultDeclaration",
			declaration: { type: "Literal" }
		};
		
		verify( root, [ root.declaration ] );
	} );
	
	it( "returns children of ExportAllDeclaration", () => {
		const root = {
			type: "ExportAllDeclaration",
			source: { type: "Literal" }
		};
		
		verify( root, [ root.source ] );
	} );
	
	it( "returns children of AwaitExpression", () => {
		const root = {
			type: "AwaitExpression",
			argument: { type: "Literal" }
		};
		
		verify( root, [ root.argument ] );
	} );
} );