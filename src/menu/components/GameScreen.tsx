import * as React from "react";
import { Segment, Grid, Container } from "semantic-ui-react";
import { Shared } from "../../shared/Shared";

export class GameScreen extends React.PureComponent {
    private shared = Shared.get_instance();
    private game_screen_container = React.createRef<HTMLDivElement>();

    public componentDidMount() {
        this.shared.game_screen_container.set(this.game_screen_container.current);
    }

    public componentWillUnmount() {
        this.shared.game_screen_container.set(null);
    }

    render() {
        return (
            <Container>
                <div id="game-screen" ref={this.game_screen_container} />
            </Container>
        );
    }
}