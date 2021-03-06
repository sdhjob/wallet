import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet,Modal,Text,Platform,TouchableHighlight,KeyboardAvoidingView,TouchableWithoutFeedback,View,Dimensions,} from 'react-native';
import { material } from 'react-native-typography';
import ProgressBar from "../components/ProgressBar";
import UColor from '../utils/Colors'
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
const prs = 0;
const tk = null;

export class EasyAddress {
    
    constructor() {
    
    }

    static bind(address) {
        this.map["address"] = address;
    }

    static unBind() {
        this.map["address"] = address;
        delete this.map["address"];
    }

    static show(title,content,okLable,disLabel,okHandler) {
        this.map["address"].setState({ 
            "visible": true,
            title,
            content,
            okLable,
            disLabel,
            okHandler
        })
    }

    static dismis() {
        this.map["address"].setState({
            "visible":false
        });
    }

    static startProgress(){
      this.map["address"].setState({okHandler:null,disLabel:null,showProgress:true});
      var th = this;
      tk = setInterval(function(){
        th.map["address"].setState({progress:prs})
      },300);
    }

    static endProgress(){
      clearInterval(tk);
    }

    static progress(total,current){
      let p = current/total;
      prs = parseInt((ScreenWidth-32)*p);
    }
}

EasyAddress.map = {};

export class Address extends React.Component {

    state = {
        visible:false,
        showProgress:false,
        progress:0
    }

    constructor(props) {
        super(props);
        EasyAddress.bind(this);
    }
    
    render() {
        return (
          <Modal
            animationType={'fade'}
            transparent={true}
            hardwareAccelerated
            visible={this.state.visible}
            onRequestClose={()=>{}}
            supportedOrientations={['portrait', 'landscape']}>
            <TouchableWithoutFeedback>
              <View style={styles.backgroundOverlay}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
                  <View style={[styles.modalContainer,styles.modalContainerPadding]}>
                    <TouchableWithoutFeedback>
                      <View>
                        <View style={styles.titleContainer}>
                            <Text style={[material.title,{color: UColor.tintColor,}]}>{this.state.title}</Text>
                        </View>
                        <View style={[styles.contentContainer,styles.contentContainerPadding]}>
                          {
                            (typeof(this.state.content)=='string')?<Text>{this.state.content}</Text>:this.state.content
                          }
                        </View>
                        <View style={styles.actionsContainer}>
                          {this.state.disLabel?(
                            <TouchableHighlight
                              testID="dialog-cancel-button"
                              style={styles.actionContainer}
                              underlayColor={UColor.arrow}
                              onPress={()=>{this.setState({visible:false})}}>
                              <Text style={[material.button, { color: UColor.tintColor, }]}>{this.state.disLabel}</Text>
                            </TouchableHighlight>
                          ):null
                        }
                        {this.state.okHandler?(
                            <TouchableHighlight
                              testID="dialog-ok-button"
                              style={styles.actionContainer}
                              underlayColor={UColor.arrow}
                              onPress={this.state.okHandler}>
                              <Text style={[material.button, { color: UColor.tintColor, }]}>{this.state.okLable}</Text>
                            </TouchableHighlight>
                          ):null
                        }
                        {this.state.showProgress?<ProgressBar
                            style={{marginTop:47,width:ScreenWidth-32}}
                            progress={this.state.progress}
                          />:null}
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </TouchableWithoutFeedback>
          </Modal>)
    }
}

const styles = StyleSheet.create({
  backgroundOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  modalContainer: {
    marginHorizontal: 16,
    marginVertical: 106,
    minWidth: 280,
    borderRadius: 2,
    elevation: 24,
    overflow: 'hidden',
    backgroundColor: UColor.fontColor,
  },
  modalContainerPadding: {
    paddingTop: 24,
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  
  contentContainer: {
    flex: -1,
  },
  contentContainerPadding: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  contentContainerScrolled: {
    flex: -1,
    maxHeight: ScreenHeight - 264, // (106px vertical margin * 2) + 52px
  },
  contentContainerScrolledPadding: {
    paddingHorizontal: 24,
  },
  actionsContainer: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: 8,
  },

  actionContainer: {
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    minWidth: 64,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
