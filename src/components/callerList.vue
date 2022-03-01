<template id="callerid-list">
    <div class="kiwi-callerlist-container">
        <h3>Caller ID Whitelist</h3>
        <div class="u-form u-input u-input-text u-input-text--focus u-input-text--reveal-value" style="display:flex;align-items:center;justify-content:center;margin:10px;background:transparent;">
            <div class="u-input-text-inputs"><input class="u-input callerid-tab-inputs" placeholder="Inserisci un nickname" type="text" v-model="callerInput" required></div>
            <div class="u-input-text-inputs"><button class="u-button u-button-primary" v-on:click="onAccept" >Aggiungi</button></div>
        </div>
        <div v-if="error" class="callerid-error">{{ error }}</div>
        <table v-if="callerList.length > 0" class="kiwi-callerlist-table">
            <tr v-for="nick of callerList">
                <td>{{ nick }}</td>
                <td>
                    <button type="button" class="u-button-primary callerid-button" @click="removeNick(nick)">Rimuovi</button>
                </td>
            </tr>
        </table>
        <span v-else class="kiwi-callerlist-empty">La lista CallerID è vuota.</span>
    </div>
</template>

<script>
    
    export default {
        template: '#callerid-list',
        data() {
            return {
                network: null,
                inProgress: false,
                callerList: [],
                callerCache: [],
                callerInput: '',
                error: '',
            };
        },
        mounted() {
            this.network = kiwi.state.getActiveNetwork();
            this.getAllowList();
            kiwi.on('irc.raw.456', (command, event, network) => {
                this.error = "⚠ La tua Caller ID whitelist è piena!";
            });
            kiwi.on('irc.raw.457', (command, event, network) => {
                this.error = "⚠ " + event.params[1] + " è già presente nella tua whitelist!";
            });
        },
        beforeDestroy() {
            kiwi.off('irc.raw.281', this.handle281);
            kiwi.off('irc.raw.282', this.handle282);
        },
        methods: {
            getAllowList() {
                if (this.inProgress) {
                    return;
                }
                this.error = '';
                this.inProgress = true;
                this.callerCache = [];
                kiwi.on('irc.raw.281', this.handle281);
                kiwi.on('irc.raw.282', this.handle282);
                this.network.ircClient.raw('ACCEPT', '*');
            },
            handle281(command, event, network) {
                //console.log('irc.raw.281', event);
                this.callerCache.push(event.params[1]);
            },
            handle282(command, event, network) {
                //console.log('irc.raw.282', event);
                kiwi.off('irc.raw.281', this.handle281);
                kiwi.off('irc.raw.282', this.handle282);
                this.callerList = this.callerCache;
                this.inProgress = false;
                this.callerCache = [];
            },
            removeNick(nick) {
                this.network.ircClient.raw('ACCEPT', '-' + nick);
                this.getAllowList();
            },
            onAccept() {
                kiwi.state.$emit('input.raw', '/ACCEPT '+ this.callerInput );
                this.getAllowList();
            },
        },

    };
</script>