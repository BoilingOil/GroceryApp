import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  AlertIOS,
} from 'react-native';
import * as firebase from 'firebase';
const StatusBar = require('./StatusBar');
const ActionButton = require('./ActionButton');
const ListItem = require('./ListItem');
const styles = require('../styles');

const firebaseConfig = {
  apiKey: "AIzaSyBdH0N41sX9BQCmNgGZ7SNIJ0fT-_JAsPE",
  authDomain: "groceryapp-f1bd1.firebaseapp.com",
  databaseURL: "https://groceryapp-f1bd1.firebaseio.com",
  projectId: "groceryapp-f1bd1",
  storageBucket: "groceryapp-f1bd1.appspot.com",
  messagingSenderId: "478757807969"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.itemsRef = firebaseApp.database().ref();
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  // componentDidMount() {
  //   this.setState({
  //     dataSource: this.state.dataSource.cloneWithRows([{ title: 'Pizza' }])
  //   })
  // }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
    //this._createUser('mayhem.beatsmith@gmail.com', 'grocery1');
    //this._signinUser('mayhem.beatsmith@gmail.com','grocery1');
  }

  // componentDidUpdate(prevProps, prevState) {
  //   firebase.auth().onAuthStateChanged(firebaseUser => {
  //     if(firebaseUser) {
  //       console.log(`User ${firebaseUser.name} logged in`)
  //     } else {
  //       console.log(`Not logged in`)
  //     }
  //   });
  // }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  _createUser(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }

  _signinUser(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }

  _signoutUser() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  _addItem() {
    AlertIOS.prompt(
      'Add New Item',
      null,
      [
        {
          text: 'Add',
          onPress: (text) => {
            this.itemsRef.push({ title: text })
          }
        },
      ],
      'plain-text'
    );
  }

  _renderItem(item) {
    const onPress = () => {
      AlertIOS.prompt(
        'Complete',
        null,
        [
          {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Cancel', onPress: (text) => console.log('Cancel')}
        ],
        'default'
      );
    };

    return (
      <ListItem item={item} onPress={onPress} />
    );
  }

  render() {
    // console.log(`Current user is: ${JSON.stringify(firebase.auth().currentUser)}`);
    return (
      <View style={styles.container}>
        <StatusBar title="Grocery List" />
        <ListView 
          dataSource={this.state.dataSource}
          renderRow={this._renderItem.bind(this)}
          enableEmptySections={true}
          style={styles.listview}
        />
        <ActionButton title="Add" onPress={this._addItem.bind(this)} />
      </View>
    );
  }
}
