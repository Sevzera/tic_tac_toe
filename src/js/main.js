import React from "react";
import ReactDOM from "react-dom/client";
import * as user from "./utils/user.js";
import "../css/tailwind.css";

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentStep: 0,
			isXNext: true,
			squareHistory: [Array(9).fill(null)],
		};
	}

	rollbackTo(i) {
		this.setState((state) => ({
			currentStep: i,
			isXNext: i % 2 === 0,
			squareHistory: this.state.squareHistory.slice(0, i + 1),
		}));
	}

	async handleClick(i, currentSquares) {
		const newSquares = currentSquares.slice();
		if (user.calculateWinner(newSquares) || newSquares[i]) {
			return;
		}
		newSquares[i] = this.state.isXNext ? "X" : "O";
		this.setState((state) => ({
			currentStep: state.squareHistory.length,
			isXNext: !state.isXNext,
			squareHistory: state.squareHistory.concat([newSquares]),
		}));
	}

	render() {
		const currentSquares = this.state.squareHistory.at(-1);
		const moveList = this.state.squareHistory.map((_, i) => {
			return (
				<li key={`btn-${i}`}>
					<button className="border-[1px] border-black px-16" onClick={() => this.rollbackTo(i)}>
						{i ? `Go to move #${i}` : "Restart game"}
					</button>
				</li>
			);
		});
		const winner = user.calculateWinner(currentSquares);
		let status = winner
			? `Winner: ${winner}`
			: `Next player: ${this.state.isXNext ? "X" : "O"}`;
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={currentSquares}
						onClick={(i) => this.handleClick(i, currentSquares)}
					/>
				</div>
				<div className="game-info">
					<div className="status">{status}</div>
					<ul>{moveList}</ul>
				</div>
			</div>
		);
	}
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
