<template id="callenable-card">
    <div class="caller-id-container">
        <span class="caller-id-icon" title="Info"><i class="fa fa-exclamation-triangle fa-2x"></i></span>
        <div class="caller-id-message">
            <div><span style="font-weight:bold">Caller ID</span> (Server Side Ignore) il tuo messaggio è stato ignorato</div>
            <div><a title="Info" class="kiwi-nick" :data-nick="nick"><i class="fa fa-question-circle" aria-hidden="true" style="margin-right:2.5px;"></i>{{ nick }}</a> ha ricevuto una notifica, attendi di essere autorizzato</div>
        </div>
    </div>
</template>

<script>
    
    export default {
        template: '#callenable-card',
        props: ['nick'],

    };
</script>