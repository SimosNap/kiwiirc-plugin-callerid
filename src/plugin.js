import CustomSelfUser from './components/CustomSelfUser.vue';
import callCard from './components/callCard.vue';
import callenableCard from './components/callenableCard.vue';
import callerList from './components/callerList.vue';
// eslint-disable-next-line no-undef
import './style.css'

kiwi.plugin('caller-id', function(kiwi, log) {
    kiwi.replaceModule('components/SelfUser', CustomSelfUser);
    
    kiwi.on('irc.raw.718', function(command, event, network){
        let nick = event.params[1];
        console.log('NICK:', nick);
        let buffer = kiwi.state.getActiveBuffer();

        const Component = kiwi.Vue.extend(callCard); const callCardComponent = new Component({ propsData: { nick: nick } });

        
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

        const eComponent = kiwi.Vue.extend(callenableCard); const callenableCardComponent = new eComponent({ propsData: { nick: nick } });
        
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
    
})
