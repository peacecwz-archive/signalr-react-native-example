/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, FlatList, Text, Button, TextInput, View} from 'react-native';
import {HubConnectionBuilder, LogLevel} from "@aspnet/signalr";

type Props = {};
type State = {
    hubConnection: HubConnection
}
export default class App extends Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            hubConnection: null,
            messages: [],
            message: '',
            nick: ''
        };
    }

    componentWillMount(): void {
        this.setState({
            hubConnection: new HubConnectionBuilder()
                .withUrl("http://localhost:5000/chat")
                .configureLogging(LogLevel.Debug)
                .build()
        });
    }

    componentDidMount(): void {
        this.state.hubConnection
            .start()
            .then(() => console.log('Connection started!'))
            .catch(err => console.log('Error while establishing connection', err));

        this.state.hubConnection.on('sendToChannel', (nick, message) => {
            const text = `${nick}: ${message}`;
            const messages = this.state.messages.concat([text]);
            this.setState({messages});
        });
    }

    sendMessage() {
        this.state.hubConnection
            .invoke('sendToChannel', this.state.nick, this.state.message)
            .catch(err => console.error(err));

        this.setState({message: ''});
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to Simple SignalR</Text>
                <TextInput
                    placeholder={"Nick name"}
                    style={{height: 40, width: 250, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({
                        nick: text
                    })}
                    value={this.state.nick}
                />
                <TextInput
                    placeholder={"Message"}
                    style={{height: 40, width: 250, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({
                        message: text
                    })}
                    value={this.state.message}
                />
                <Button
                    onPress={this.sendMessage.bind(this)}
                    title="Send"
                    color="#841584"
                />
                <FlatList
                    data={this.state.messages}
                    renderItem={({item}) => <Text>{item}</Text>}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
