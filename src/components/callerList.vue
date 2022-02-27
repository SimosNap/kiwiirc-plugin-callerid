<template id="callerid-list">
    <div class="kiwi-callerlist-container">
        <h3>Caller ID</h3>
        <table v-if="callerList.length > 0" class="kiwi-callerlist-table">
            <tr v-for="nick of callerList">
                <td>{{ nick }}</td>
                <td>
                    <button type="button" @click="removeNick(nick)">Rimuovi</button>
                </td>
            </tr>
        </table>
        <span v-else class="kiwi-callerlist-empty">La lista CallerID è vuota.</span>
        <!-- <div v-for="nick of callerList">
            {{ nick }}
            <button type="button" @click="removeNick(nick)">Remove</button> -->
        </div>
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
            };
        },
        mounted() {
            this.network = kiwi.state.getActiveNetwork();
            this.getAllowList();
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
        },

    };
</script>