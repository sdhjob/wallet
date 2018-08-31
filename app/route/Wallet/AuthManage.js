import React from 'react';
import { connect } from 'react-redux'
import {Dimensions,DeviceEventEmitter,InteractionManager,ListView,StyleSheet,View,RefreshControl,Text,ScrollView,Image,Platform,Clipboard,TextInput,KeyboardAvoidingView,TouchableOpacity,TouchableHighlight} from 'react-native';
import {TabViewAnimated, TabBar, SceneMap} from 'react-native-tab-view';
import UColor from '../../utils/Colors'
import Button from  '../../components/Button'
import Item from '../../components/Item'
import Icon from 'react-native-vector-icons/Ionicons'
import UImage from '../../utils/Img'
import Header from '../../components/Header'
import ScreenUtil from '../../utils/ScreenUtil'
import { EasyToast } from '../../components/Toast';
import BaseComponent from "../../components/BaseComponent";
import { EasyShowLD } from "../../components/EasyShow"
import Ionicons from 'react-native-vector-icons/Ionicons'

var dismissKeyboard = require('dismissKeyboard');
@connect(({wallet, vote}) => ({...wallet, ...vote}))
class AuthManage extends BaseComponent {

  static navigationOptions = {
    headerTitle: '权限管理',
    header:null, 
  };
 
  constructor(props) {
    super(props);
    this.state = {
        ownerPk: '',
        activePk: '',
        ownerThreshold:'1',//owner权阀值
        activeThreshold:'1',//active权阀值
      }
  }
    //组件加载完成
    componentDidMount() {
        this.setState({
            ownerPk: this.props.navigation.state.params.wallet.ownerPublic,//ownerPublic
            activePk: this.props.navigation.state.params.wallet.activePublic,
        })
        this.getAuthInfo();
    }
  
  componentWillUnmount(){
    //结束页面前，资源释放操作
    super.componentWillUnmount();
  }
 
    //获取账户信息
    getAuthInfo(){
        EasyShowLD.loadingShow();
        this.props.dispatch({ type: 'vote/getAuthInfo', payload: { page:1,username: this.props.navigation.state.params.wallet.name},callback: (resp) => {
            EasyShowLD.loadingClose();

            if(resp && resp.code == '0'){
                var temActiveKey='';
                var temOwnerKey='';
    
                var authTempOwner=resp.data.permissions[1].required_auth.keys
                var authTempActive=resp.data.permissions[0].required_auth.keys
                //公钥
                for(var i=0;i<authTempOwner.length;i++){
                    if((authTempOwner[i].key == this.props.navigation.state.params.wallet.activePublic)||(authTempOwner[i].key == this.props.navigation.state.params.wallet.ownerPublic)){
                        temOwnerKey=authTempOwner[i].key;
                    }
                }
    
                for(var i=0;i<authTempActive.length;i++){
                    if((authTempActive[i].key == this.props.navigation.state.params.wallet.activePublic)||(authTempActive[i].key == this.props.navigation.state.params.wallet.ownerPublic)){
                        temActiveKey=authTempActive[i].key;
                    }
                }
    
                this.setState({
                    activeThreshold:resp.data.permissions[0].required_auth.threshold,
                    ownerThreshold:resp.data.permissions[1].required_auth.threshold,//owner权阀值
    
                    ownerPk: temOwnerKey,
                    activePk: temActiveKey,
                });
            }

        } });
    }

  transferByOwner() {
    const { navigate } = this.props.navigation;
    navigate('AuthTransfer', { wallet:this.props.navigation.state.params.wallet});
  }

  manageByActive() {
    const { navigate } = this.props.navigation;
    navigate('AuthChange', { wallet:this.props.navigation.state.params.wallet});
  }

  dismissKeyboardClick() {
    dismissKeyboard();
  }

  render() {
    return <View style={[styles.container,{backgroundColor: UColor.secdColor}]}>
      <Header {...this.props} onPressLeft={true} title="权限管理" />
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={[styles.header,{backgroundColor: UColor.secdColor}]}>
            <View style={[styles.inptoutbg,{backgroundColor: UColor.secdColor}]}>
                {this.state.ownerPk != '' && <View style={[styles.addUserTitle,{backgroundColor: UColor.mainColor}]} >
                    <View style={{flex:1,flexDirection: "row",}}>
                        <View style={{flex:1,flexDirection: "column",}}>
                            <View style={styles.titleStyle}>
                                <View style={styles.userAddView}>
                                    <Text style={[styles.inptitle,{color: UColor.fontColor}]}> Owner关联公钥（拥有者）</Text>
                                </View>
                                <View style={styles.buttonView}>
                                    <Text style={[styles.weightText,{color: UColor.arrow}]}>权重阀值  </Text>
                                    <Text style={[styles.buttonText,{color: UColor.fontColor}]}>{this.state.activeThreshold}</Text>
                                </View>
                            </View>
                            <View style={styles.showPkStyle}>
                                <Text style={[styles.inptext,{color: UColor.arrow}]}>{this.state.ownerPk}</Text>
                            </View>
                        </View>

                        <TouchableHighlight onPress={() => { this.transferByOwner() }} activeOpacity={0.5} underlayColor={UColor.mainColor}>
                            <View style={styles.enterButton}> 
                                <Ionicons color={UColor.fontColor} name="ios-arrow-forward-outline" size={ScreenUtil.setSpText(21)} color={UColor.arrow} />     
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>}

               {this.state.activePk != '' && <View style={[styles.addUserTitle,{backgroundColor: UColor.mainColor}]} >
                    <View style={{flex:1,flexDirection: "row",}}>
                        <View style={{flex:1,flexDirection: "column",}}>
                            <View style={styles.titleStyle}>
                                <View style={styles.userAddView}>
                                    <Text style={[styles.inptitle,{color: UColor.fontColor}]}> Active关联公钥（管理者）</Text>
                                </View>
                                <View style={styles.buttonView}>
                                    <Text style={[styles.weightText,{color: UColor.arrow}]}>权重阀值 </Text>
                                    <Text style={[styles.buttonText,{color: UColor.fontColor}]}>{this.state.activeThreshold}</Text>
                                </View>
                            </View>
                            <View style={styles.showPkStyle}>
                                <Text style={[styles.inptext,{color: UColor.arrow}]}>{this.state.activePk}</Text>
                            </View>
                        </View>

                        <TouchableHighlight onPress={() => { this.manageByActive() }} activeOpacity={0.5} underlayColor={UColor.mainColor}>
                            <View style={styles.enterButton}> 
                                <Ionicons color={UColor.fontColor} name="ios-arrow-forward-outline" size={ScreenUtil.setSpText(21)} color={UColor.arrow} />     
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>}



            </View>
            <View style={styles.textout}>
                <Text style={[styles.titletext,{color: UColor.fontColor}]}>什么是拥有者权限（Owner）？</Text>
                <Text style={[styles.explaintext,{color: UColor.arrow}]}>Owner 代表了对账户的所有权，可以对权限进行设置，管理Active和其他角色。</Text>
                <Text style={[styles.titletext,{color: UColor.fontColor}]}>什么是管理者权限（Active）？</Text>
                <Text style={[styles.explaintext,{color: UColor.arrow}]}>Active 用于日常使用，比如转账，投票等。</Text>
                <Text style={[styles.titletext,{color: UColor.fontColor}]}>什么是权重阈值？</Text>
                <Text style={[styles.explaintext,{color: UColor.arrow}]}>权重阈值是使用该权限的最低权重要求。</Text>
            </View>
        </View>
      </ScrollView>
    </View>
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'column',
    },
    scrollView: {

    },
    header: {
        marginTop: 10,
    },
    inptoutbg: {
        flex: 1,
        flexDirection:'column',
    },

    addUserTitle: {
        flex: 1,
        margin: 5,
        paddingBottom: 10,
        borderRadius: 5,
    },
    titleStyle:{
        flex:1,
        marginTop: 5,
        marginBottom: 1,
        marginLeft:11,
        // marginRight:12,
        flexDirection:'row',
    },

     //用户添加样式  
     userAddView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },

    inptitle: {
        fontSize: 15,
        lineHeight: 30,
    },
     // 按钮  
    buttonView: {
        flexDirection: "row",
        paddingRight: 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    weightText: {
        fontSize: 12,
        lineHeight: 30,
    },
    buttonText: {
        fontSize: 12,
        lineHeight: 30,
    },

    inptgo: {
        flex: 1,
        height: 50,
        paddingHorizontal: 15,
    },

    showPkStyle: {
        flex: 1,
        paddingRight: 10,
        marginLeft:15,
        marginRight:5,
        borderRadius: 5,
    },



    inptext: {
        fontSize: 14,
        lineHeight: 25,
    },
    textout: {
        marginTop: 100,
        paddingLeft: 20,
        paddingRight: 30,
        paddingVertical: 20,
    },
    titletext: {
        fontSize: 15,
        paddingVertical: 8,
    },
    explaintext: {
        fontSize: 13,
        paddingVertical: 5,
        marginBottom: 10,
    },
    imgBtn: {
        width: 30,
        height: 30,
        marginBottom: 5,
        marginHorizontal:5,
      },


     // 按钮  
    enterButton: {
        flex: 1,
        paddingTop: 10,
        flexDirection: "row",
        paddingHorizontal: 10,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bomout: {
        paddingHorizontal: 5,
        width: ScreenUtil.autowidth(40),
        justifyContent: 'center',
        alignItems: 'flex-end',
      },

});

export default AuthManage;
