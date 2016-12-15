class Traveler {
	constructor( root ) {
		this.fringe = [ root ];
	}

	pushNodesToFringe( nodes ) {
		for( let i = nodes.length - 1; i >= 0; i-- ) {
			this.fringe.push( nodes[i] );
		}
	}

	getNext() {
		let currentNode = this.fringe.pop();

		switch( currentNode.type ) {
		case "Program":
		case "BlockStatement":
		case "ClassBody":
			this.pushNodesToFringe( currentNode.body );
			break;
		case "FunctionDeclaration":
		case "FunctionExpression":
		case "ArrowFunctionExpression":
			this.fringe.push( currentNode.body );
			this.pushNodesToFringe( currentNode.params );
			if( currentNode.id !== null ) {
				this.fringe.push( currentNode.id );
			}
			break;
		case "ExpressionStatement":
			this.fringe.push( currentNode.expression );
			break;
		case "WithStatement":
			this.fringe.push( currentNode.body );
			this.fringe.push( currentNode.object );
			break;
		case "ReturnStatement":
		case "ThrowStatement":
		case "UnaryExpression":
		case "UpdateExpression":
		case "SpreadElement":
		case "YieldExpression":
		case "RestElement":
		case "AwaitExpression":
			if( currentNode.argument !== null ) {
				this.fringe.push( currentNode.argument );
			}
			break;
		case "LabeledStatement":
			this.fringe.push( currentNode.body );
			this.fringe.push( currentNode.label );
			break;
		case "BreakStatement":
		case "ContinueStatement":
			if( currentNode.label !== null ) {
				this.fringe.push( currentNode.label );
			}
			break;
		case "IfStatement":
		case "ConditionalExpression":
			if( currentNode.alternate !== null ) {
				this.fringe.push( currentNode.alternate );
			}
			this.fringe.push( currentNode.consequent );
			this.fringe.push( currentNode.test );
			break;
		case "SwitchCase":
			this.pushNodesToFringe( currentNode.consequent );
			if( currentNode.test !== null ) {
				this.fringe.push( currentNode.test );
			}
			break;
		case "SwitchStatement":
			this.pushNodesToFringe( currentNode.cases );
			this.fringe.push( currentNode.discriminant );
			break;
		case "CatchClause":
			this.fringe.push( currentNode.body );
			this.fringe.push( currentNode.param );
			break;
		case "TryStatement":
			if( currentNode.finalizer !== null ) {
				this.fringe.push( currentNode.finalizer );
			}
			if( currentNode.handler !== null ) {
				this.fringe.push( currentNode.handler );
			}
			this.fringe.push( currentNode.block );
			break;
		case "WhileStatement":
			this.fringe.push( currentNode.body );
			this.fringe.push( currentNode.test );
			break;
		case "DoWhileStatement":
			this.fringe.push( currentNode.test );
			this.fringe.push( currentNode.body );
			break;
		case "ForStatement":
			this.fringe.push( currentNode.body );
			if( currentNode.update !== null ) {
				this.fringe.push( currentNode.update );
			}
			if( currentNode.test !== null ) {
				this.fringe.push( currentNode.test );
			}
			if( currentNode.init !== null ) {
				this.fringe.push( currentNode.init );
			}
			break;
		case "ForInStatement":
		case "ForOfStatement":
			this.fringe.push( currentNode.body );
			this.fringe.push( currentNode.right );
			this.fringe.push( currentNode.left );
			break;
		case "VariableDeclarator":
			if( currentNode.init !== null ) {
				this.fringe.push( currentNode.init );
			}
			this.fringe.push( currentNode.id );
			break;
		case "VariableDeclaration":
			this.pushNodesToFringe( currentNode.declarations );
			break;
		case "ArrayExpression":
		case "ArrayPattern":
			let elements = currentNode.elements.filter( ( element ) => element !== null );
			this.pushNodesToFringe( elements );
			break;
		case "Property":
		case "AssignmentProperty":
		case "MethodDefinition":
			this.fringe.push( currentNode.value );
			this.fringe.push( currentNode.key );
			break;
		case "ObjectExpression":
		case "ObjectPattern":
			this.pushNodesToFringe( currentNode.properties );
			break;
		case "BinaryExpression":
		case "AssignmentExpression":
		case "LogicalExpression":
			this.fringe.push( currentNode.right );
			this.fringe.push( currentNode.left );
			break;
		case "MemberExpression":
			this.fringe.push( currentNode.property );
			this.fringe.push( currentNode.object );
			break;
		case "CallExpression":
			this.pushNodesToFringe( currentNode.arguments );
			this.fringe.push( currentNode.callee );
			break;
		case "SequenceExpression":
			this.pushNodesToFringe( currentNode.expressions );
			break;
		case "TemplateLiteral":
			this.pushNodesToFringe( currentNode.expressions );
			this.pushNodesToFringe( currentNode.quasis );
			break;
		case "ClassDeclaration":
		case "ClassExpression":
			this.fringe.push( currentNode.body );
			if( currentNode.superClass !== null ) {
				this.fringe.push( currentNode.superClass );
			}
			if( currentNode.id !== null ) {
				this.fringe.push( currentNode.id );
			}
			break;
		case "MetaProperty":
			this.fringe.push( currentNode.property );
			this.fringe.push( currentNode.meta );
			break;
		case "ImportSpecifier":
		case "ImportDefaultSpecifier":
		case "ImportNamespaceSpecifier":
			this.fringe.push( currentNode.local );
			break;
		case "ImportDeclaration":
			this.fringe.push( currentNode.source );
			this.pushNodesToFringe( currentNode.specifiers );
			break;
		case "ExportSpecifier":
			this.fringe.push( currentNode.exported );
			break;
		case "ExportNamedDeclaration":
			this.fringe.push( currentNode.source );
			this.pushNodesToFringe( currentNode.specifiers );
			this.fringe.push( currentNode.declaration );
			break;
		case "ExportDefaultDeclaration":
			this.fringe.push( currentNode.declaration );
			break;
		case "ExportAllDeclaration":
			this.fringe.push( currentNode.source );
			break;
		}

		return currentNode;
	}

	isDone() {
		return this.fringe.length === 0;
	}

	next() {
		let isDone = this.isDone();
		return {
			value: isDone ? undefined : this.getNext(),
			next: () => this.next(),
			done: isDone
		};
	}

	[Symbol.iterator]() {
		return this;
	}
}

module.exports = Traveler;