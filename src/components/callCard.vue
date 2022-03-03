<template id="call-card">
    <div class="caller-id-container">
        <span class="caller-id-icon" title="Info"><i class="fa fa-bell fa-2x"></i></span>
        <div class="caller-id-message">
            <div><a title="Info" class="kiwi-nick" :data-nick="nick"><i class="fa fa-question-circle" aria-hidden="true" style="margin-right:2.5px;"></i>{{ nick }}</a> ha provato a inviarti un messaggio privato, ma è stato ignorato</div>
            <div>Vuoi autorizzare <a title="Info" class="kiwi-nick" :data-nick="nick">{{ nick }}</a> a comunicare con te? <button class="u-button-primary callerid-button" @click="accept()">Autorizza</button></div>
        </div>
    </div>
</template>

<script>
    export default {
        template: '#call-card',
        props: ['nick'],
        methods: {
            accept: function accept() {

                let network = window.kiwi.state.getActiveNetwork();
                kiwi.state.$emit('input.raw', '/ACCEPT +'+ this.nick );
                kiwi.state.getOrAddBufferByName(network.id, this.nick);
                kiwi.state.setActiveBuffer(network.id, this.nick);
                //kiwi.state.$emit('input.raw', '/NOTICE '+ this.nick + ' Il tuo messaggio è stato accettato');
                let buffer = kiwi.state.getActiveBuffer();
                kiwi.state.addMessage(buffer,
                    {
                        'message': '⚠ ' + this.nick + ' è stato aggiunto alla tua Whitelist',
                        'bodyTemplate': '',
                        'nick': '',
                        'ident': 'INFO',
                        'hostname': 'INFO',
                        'type' : 'notice',
                    }
                );
                
            },
            
            reject: function reject() {
                let network = window.kiwi.state.getActiveNetwork();
                kiwi.state.$emit('input.raw', '/ACCEPT -'+ this.nick );
            },
        },
    };
</script>