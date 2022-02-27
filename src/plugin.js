import CustomSelfUser from './components/CustomSelfUser.vue';
import callCard from './components/callCard.vue';
import callenableCard from './components/callenableCard.vue';
import callerList from './components/callerList.vue';
// eslint-disable-next-line no-undef
import './style.css'

kiwi.plugin('caller-id', function(kiwi, log) {
    
    kiwi.on('irc.raw.718', function(command, event, network){
        let nick = event.params[1];
        let buffer = kiwi.state.getActiveBuffer();

        let component = new callCard(); component.$mount();
        
        let message = {
            time: Date.now(),
            nick: '',
            message: 'nick',
            type: 'callerid',
            tags: event.tags || {},
            bodyTemplate: component,
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

        let component = new callenableCard(); component.$mount();
        
        let message = {
            time: Date.now(),
            nick: '',
            message: 'nick',
            type: 'callerid',
            tags: event.tags || {},
            bodyTemplate: component,
        };
        
        //
        kiwi.state.addMessage(buffer, message);
        event.handled = true;
        return;
    })
    
    kiwi.replaceModule('components/SelfUser', CustomSelfUser);
    kiwi.addTab('server', 'CallerID', callerList);
    
})
