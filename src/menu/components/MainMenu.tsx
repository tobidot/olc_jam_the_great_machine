import * as React from "react"
import { render } from "react-dom"
import { Grid, Menu, Button, Container, Segment } from "semantic-ui-react";

interface State {
    page: MainMenuPage
}

enum MainMenuPage {
    MENU
}

export class MainMenu extends React.Component {
    public state: State = {
        page: MainMenuPage.MENU
    };

    render() {
        return (
            <Grid centered columns={3}>
                <Grid.Column verticalAlign="middle">
                    <Button.Group vertical>
                        <Button positive>
                            Start
                        </Button>
                        <Button negative>
                            Quit
                        </Button>
                    </Button.Group>
                </Grid.Column>
            </Grid>
        );
    }
}