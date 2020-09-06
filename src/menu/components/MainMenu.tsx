import * as React from "react"
import { render } from "react-dom"
import { Grid, Menu, Button, Container, Segment } from "semantic-ui-react";
import { Shared } from "../../shared/Shared";

interface State {
    page: MainMenuPage;
    music_volume: number;
}

enum MainMenuPage {
    MENU
}

export class MainMenu extends React.Component {
    public state: State = {
        page: MainMenuPage.MENU,
        music_volume: 1,
    };

    render() {
        const shared = Shared.get_instance();
        const is_music_playing = !!shared.background_music.get()?.isPlaying();
        const music_volume = Math.floor(this.state.music_volume * 100).toString();
        const is_debug_mode = shared.debug_mode.get();
        return (
            <Grid centered columns={3}>
                <Grid.Row>
                    <Grid.Column verticalAlign="middle">
                        <Button.Group vertical>
                            <Button positive>
                                Start
                        </Button>
                            <Button onClick={this.toggle_music_func} color={is_music_playing ? "orange" : "grey"} >
                                {is_music_playing ? "Mute" : "Unmute"} music
                        </Button>
                            <Button onClick={this.toggle_debug_mode_func} color={is_debug_mode ? "orange" : "grey"} >
                                Debug Mode: {is_debug_mode ? "ON" : "OFF"}
                            </Button>
                            <Button negative>
                                Quit
                        </Button>
                        </Button.Group>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={3}>
                    <Grid.Column verticalAlign="middle" textAlign="left">
                        <label htmlFor="background-music-volume">
                            Background Music Volume:
                        </label>
                        <input id="background-music-volume" type="Range" min="0" max="100" value={this.state.music_volume} onChange={this.change_music_volume_func}></input>
                    </Grid.Column>
                    <Grid.Column verticalAlign="middle" textAlign="left">
                        Empty
                    </Grid.Column>
                    <Grid.Column verticalAlign="middle" textAlign="left">
                        Empty
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    public change_music_volume_func = (event) => {
        const music = Shared.get_instance().background_music.get();
        if (!music || !music.isLoaded()) return;
        const wanted_volume = parseInt(event.target.value) / 100.0;
        music.setVolume(wanted_volume);
        this.setState({ music_volume: event.target.value });
    }

    public toggle_music_func = () => {
        const music = Shared.get_instance().background_music.get();
        if (!music || !music.isLoaded()) return;
        if (music.isPlaying()) {
            music.pause();
        } else {
            music.play();
        }
        this.forceUpdate();
    }

    public toggle_debug_mode_func = () => {
        const shared = Shared.get_instance();
        shared.debug_mode.set(!shared.debug_mode.get());
        this.forceUpdate();
    }
}