const nodeActions = new Map();

function newNodeAction( nodes, action ) {
	let firstNode = nodes[0];
	nodeActions.set( firstNode, action );
	
	for( let i = 1; i < nodes.length; i++ ) {
		nodeActions.set( nodes[i], action );
	}
}

newNodeAction( [
		"Program",
		"BlockStatement",
		"ClassBody" ], ( currentNode ) =>
	currentNode.body );

newNodeAction( [
		"FunctionDeclaration",
		"FunctionExpression",
		"ArrowFunctionExpression" ], ( currentNode ) =>
	[ currentNode.id, ...currentNode.params, currentNode.body ] );

newNodeAction( [ "ExpressionStatement" ], ( currentNode ) =>
	[ currentNode.expression ] );

newNodeAction( [ "WithStatement" ], ( currentNode ) =>
	[ currentNode.object, currentNode.body ] );

newNodeAction( [
		"ReturnStatement",
		"ThrowStatement",
		"UnaryExpression",
		"UpdateExpression",
		"SpreadElement",
		"YieldExpression",
		"RestElement",
		"AwaitExpression" ], ( currentNode ) =>
	[ currentNode.argument ] );

newNodeAction( [ "LabeledStatement" ], ( currentNode ) =>
	[ currentNode.label, currentNode.body ] );

newNodeAction( [
		"BreakStatement",
		"ContinueStatement" ], ( currentNode ) =>
	[ currentNode.label ] );

newNodeAction( [
		"IfStatement",
		"ConditionalExpression" ], ( currentNode ) =>
	[ currentNode.test, currentNode.consequent, currentNode.alternate ] );

newNodeAction( [ "SwitchCase" ], ( currentNode ) =>
	[ currentNode.test, ...currentNode.consequent ] );

newNodeAction( [ "SwitchStatement" ], ( currentNode ) =>
	[ currentNode.discriminant, ...currentNode.cases ] );

newNodeAction( [ "TryStatement" ], ( currentNode ) =>
	[ currentNode.block, currentNode.handler, currentNode.finalizer ] );

newNodeAction( [ "CatchClause" ], ( currentNode ) =>
	[ currentNode.param, currentNode.body ] );

newNodeAction( [ "WhileStatement" ], ( currentNode ) =>
	[ currentNode.test, currentNode.body ] );

newNodeAction( [ "DoWhileStatement" ], ( currentNode ) =>
	[ currentNode.body, currentNode.test ] );

newNodeAction( [ "ForStatement" ], ( currentNode ) =>
	[ currentNode.init, currentNode.test, currentNode.update, currentNode.body ] );

newNodeAction( [
		"ForInStatement",
		"ForOfStatement" ], ( currentNode ) =>
	[ currentNode.left, currentNode.right, currentNode.body ] );

newNodeAction( [ "VariableDeclarator" ], ( currentNode ) =>
	[ currentNode.id, currentNode.init ] );

newNodeAction( [ "VariableDeclaration" ], ( currentNode ) =>
	currentNode.declarations );

newNodeAction( [
		"ArrayExpression",
		"ArrayPattern" ], ( currentNode ) =>
	currentNode.elements );

newNodeAction( [
		"Property",
		"AssignmentProperty",
		"MethodDefinition" ], ( currentNode ) =>
	[currentNode.key, currentNode.value ] );

newNodeAction( [
		"ObjectExpression",
		"ObjectPattern" ], ( currentNode ) =>
	currentNode.properties );

newNodeAction( [
		"BinaryExpression",
		"AssignmentExpression",
		"LogicalExpression" ], ( currentNode ) =>
	[ currentNode.left, currentNode.right ] );

newNodeAction( [ "MemberExpression" ], ( currentNode ) =>
	[ currentNode.object, currentNode.property ] );

newNodeAction( [ "CallExpression" ], ( currentNode ) =>
	[ currentNode.callee, ... currentNode.arguments ] );

newNodeAction( [ "SequenceExpression" ], ( currentNode ) =>
	currentNode.expressions );

newNodeAction( [ "TemplateLiteral" ], ( currentNode ) =>
	[ ...currentNode.quasis, ...currentNode.expressions ] );

newNodeAction( [
		"ClassDeclaration",
		"ClassExpression" ], ( currentNode ) =>
	[ currentNode.id, currentNode.superClass, currentNode.body ] );

newNodeAction( [ "MetaProperty" ], ( currentNode ) =>
	[ currentNode.meta, currentNode.property ] );

newNodeAction( [
		"ImportSpecifier",
		"ImportDefaultSpecifier",
		"ImportNamespaceSpecifier" ], ( currentNode ) =>
	[ currentNode.local ] );

newNodeAction( [ "ImportDeclaration" ], ( currentNode ) =>
	[ ...currentNode.specifiers, currentNode.source ] );

newNodeAction( [ "ExportSpecifier" ], ( currentNode ) =>
	[ currentNode.exported ] );

newNodeAction( [ "ExportNamedDeclaration" ], ( currentNode ) =>
	[ currentNode.declaration, ...currentNode.specifiers, currentNode.source ] );

newNodeAction( [ "ExportDefaultDeclaration" ], ( currentNode ) =>
	[ currentNode.declaration ] );

newNodeAction( [ "ExportAllDeclaration" ], ( currentNode ) =>
	[ currentNode.source ] );

class Traveler {
	constructor( root ) {
		this.fringe = [ root ];
	}
	
	getNext() {
		let currentNode = this.fringe.pop();
		
		let nodeAction = nodeActions.get( currentNode.type );
		
		if( nodeAction !== undefined ) {
			let childNodes = nodeAction( currentNode );
			
			let i = childNodes.length;
			
			while( i-- > 0 ) {
				let childNode = childNodes[ i ];
				if( childNode !== null ) {
					this.fringe.push( childNode );
				}
			}
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