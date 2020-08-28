import * as React from "react"
import { Button, Menu, Segment, Container, Grid } from "semantic-ui-react"
import { GameMenuState } from "../data/GameMenuState";
import { MainMenu } from "./MainMenu";
import { GameScreen } from "./GameScreen";

interface Props {
}

interface State {
    activeItem: GameMenuState;
}

export class Application extends React.Component<Props, State> {
    public state: State = {
        activeItem: GameMenuState.GAME
    }

    render() {
        return (
            <>
                <Menu tabular size="large">
                    {this.renderMainTab()}
                    {this.renderGameTab()}
                </Menu>
                {this.renderContent()}
            </>
        );
    }

    renderContent() {
        switch (this.state.activeItem) {
            case GameMenuState.MAIN:
                return <MainMenu />;
            case GameMenuState.GAME:
                return <GameScreen />;
        }
    }

    renderMainTab() {
        return <Menu.Item
            name='MAIN'
            active={this.state.activeItem === GameMenuState.MAIN}
            onClick={this.handleItemClick}
        >
            Main
        </Menu.Item>
    }

    renderGameTab() {
        return <Menu.Item
            name='GAME'
            active={this.state.activeItem === GameMenuState.GAME}
            onClick={this.handleItemClick}
        >
            Game
        </Menu.Item>
    }

    handleItemClick = (event, target) => {
        this.setState({
            activeItem: (GameMenuState[target.name as keyof GameMenuState])
        })
    }
}