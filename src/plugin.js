import CustomSelfUser from './components/CustomSelfUser.vue';
import UserBoxAccept from './components/UserBoxAccept.vue';
import callCard from './components/callCard.vue';
import callenableCard from './components/callenableCard.vue';
import callerList from './components/callerList.vue';
// eslint-disable-next-line no-undef
import './style.css'

kiwi.plugin('caller-id', function(kiwi, log) {
    kiwi.replaceModule('components/SelfUser', CustomSelfUser);
    
    kiwi.on('buffer.new', function(event){

        if ((event.buffer.getNetwork().state === 'connected') && (kiwi.state.getActiveNetwork().ircClient.user.modes.has('g')) && (event.buffer.isQuery())) {

            var mynick = kiwi.state.getActiveNetwork().nick;
            //var buffer = kiwi.state.getActiveBuffer();
            
            kiwi.state.addMessage(event.buffer,
                {
                    'message': '⚠ Caller ID attivo, accertati che ' + event.buffer.name + ' sia presente nella tua whitelist prima di inviare un messaggio',
                    'bodyTemplate': '',
                    'nick': '',
                    'ident': 'INFO',
                    'hostname': 'INFO',
                    'type' : 'error',
                    'target': mynick,
                }
            );
            
        }
    })
    
    kiwi.on('irc.raw.456', function(command, event, network){

            var mynick = kiwi.state.getActiveNetwork().nick;
            //var buffer = kiwi.state.getActiveBuffer();
            let buffer = kiwi.state.getActiveBuffer();
            
            kiwi.state.addMessage(buffer,
                {
                    'message': '⚠ La tua Caller ID whitelist è piena',
                    'bodyTemplate': '',
                    'nick': '',
                    'ident': 'INFO',
                    'hostname': 'INFO',
                    'type' : 'notice',
                    'target': mynick,
                }
            );
        
    });

    kiwi.on('irc.raw.457', function(command, event, network){

            var mynick = kiwi.state.getActiveNetwork().nick;
            //var buffer = kiwi.state.getActiveBuffer();
            let buffer = kiwi.state.getActiveBuffer();
            
            kiwi.state.addMessage(buffer,
                {
                    'message': '⚠ ' + event.params[1] + ' è già presente nella tua Whitelist',
                    'bodyTemplate': '',
                    'nick': '',
                    'ident': 'INFO',
                    'hostname': 'INFO',
                    'type' : 'error',
                    'target': mynick,
                }
            );
        
    });
    
    kiwi.on('irc.raw.718', function(command, event, network){
        let nick = event.params[1];
        let buffer = kiwi.state.getActiveBuffer();

        const Component = kiwi.Vue.extend(callCard);
        const callCardComponent = new Component({ propsData: { nick: nick } });

        callCardComponent.$mount();
        
        let message = {
            time: Date.now(),
            nick: '',
            message: 'nick',
            type: 'callerid',
            tags: event.tags || {},
            bodyTemplate: callCardComponent,
        };
        
        kiwi.state.addMessage(buffer, message);
        event.handled = true;
        return;
     
    })
    // has been informed that you messaged them.
    kiwi.on('irc.raw.717', function(command, event, network){
        let nick = event.params[1];
        event.handled = true;
        return;
     
    })        
    // :is in +g mode (server-side ignore).
    kiwi.on('irc.raw.716', function(command, event, network){
        let nick = event.params[1];
        let buffer = kiwi.state.getActiveBuffer();

        const eComponent = kiwi.Vue.extend(callenableCard);
        const callenableCardComponent = new eComponent({ propsData: { nick: nick } });
        
        callenableCardComponent.$mount();
        
        let message = {
            time: Date.now(),
            nick: '',
            message: 'nick',
            type: 'callerid',
            tags: event.tags || {},
            bodyTemplate: callenableCardComponent,
        };
        
        //
        kiwi.state.addMessage(buffer, message);
        event.handled = true;
        return;
    })

    kiwi.addTab('server', 'CallerID', callerList);
    const UserButton = new kiwi.Vue(UserBoxAccept); 
    //UserButton.$mount();
    //kiwi.addUi('userbox_button', UserButton.$mount().$el);
    kiwi.addUi('userbox_button', UserButton);
    
})
