import * as React from "react"
import { render } from "react-dom"
import { Grid, Menu, Button, Container, Segment } from "semantic-ui-react";
import { Shared } from "../../shared/Shared";

interface State {
    page: MainMenuPage;
    music_volume: number;

    universe_size: number;
    universe_density: number;
    system_density: number;
    planets: number;
    drones: number;
}

enum MainMenuPage {
    MENU
}


export class MainMenu extends React.Component {
    public state: State;

    constructor(props) {
        super(props);
        const shared = Shared.get_instance();
        this.state = {
            page: MainMenuPage.MENU,
            music_volume: 1,

            universe_size: shared.universe_size.get(),
            universe_density: shared.system_density.get(),
            system_density: shared.asteroid_density.get(),
            planets: shared.planets.get(),
            drones: shared.drones.get(),
        };
    }

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
                            <Button onClick={this.new_game_func} color={"purple"} >
                                New Game
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
                        <label htmlFor="universe-size-volume">
                            Size of the universe: {this.state.universe_size.toString()}
                        </label>
                        <input id="universe-size-volume" type="Range" min="500" max="10000" value={this.state.universe_size}
                            onChange={this.change_universe_size_func}></input>

                        <label htmlFor="universe-density">
                            Universe density: {this.state.universe_density.toString() + "%"}
                        </label>
                        <input id="universe-density" type="Range" step="1" min="1" max="100" value={this.state.universe_density}
                            onChange={this.change_system_density_func}></input>

                        <label htmlFor="system-density">
                            System density: {this.state.system_density.toString() + "%"}
                        </label>
                        <input id="system-density" type="Range" step="1" min="1" max="100" value={this.state.system_density}
                            onChange={this.change_asteroid_density_func}></input>

                        <label htmlFor="planets">
                            Planets: {this.state.planets.toString()}
                        </label>
                        <input id="planets" type="Range" step="1" min="0" max="50" value={this.state.planets}
                            onChange={this.change_planets_func}></input>

                        <label htmlFor="drones">
                            Drones: {this.state.drones.toString()}
                        </label>
                        <input id="drones" type="Range" step="1" min="10" max="600" value={this.state.drones}
                            onChange={this.change_drones_func}></input>


                    </Grid.Column>
                    <Grid.Column verticalAlign="middle" textAlign="left">
                        Empty
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    public change_universe_size_func = (event) => {
        const wanted = parseInt(event.target.value);
        this.setState({
            universe_size: wanted
        }, () => {
            Shared.get_instance().universe_size.set(wanted);
        });
    }

    public change_system_density_func = (event) => {
        const wanted = parseInt(event.target.value);
        this.setState({
            universe_density: wanted
        }, () => {
            Shared.get_instance().system_density.set(wanted / 100);
        });
    }

    public change_asteroid_density_func = (event) => {
        const wanted = parseInt(event.target.value);
        this.setState({
            system_density: wanted
        }, () => {
            Shared.get_instance().asteroid_density.set(wanted / 100);
        });
    }

    public change_planets_func = (event) => {
        const wanted = parseInt(event.target.value);
        this.setState({
            planets: wanted
        }, () => {
            Shared.get_instance().planets.set(wanted);
        });
    }

    public change_drones_func = (event) => {
        const wanted = parseInt(event.target.value);
        this.setState({
            drones: wanted
        }, () => {
            Shared.get_instance().drones.set(wanted);
        });
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

    public new_game_func = () => {
        const game = Shared.get_instance().game.get();
        if (game) {
            game.restart_game();
        }
    }
}