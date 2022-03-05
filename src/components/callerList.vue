<template id="callerid-list">
    <div class="kiwi-callerlist-container">
        <h3>Caller ID Whitelist</h3>
        <form class="u-form u-input u-input-text u-input-text--focus u-input-text--reveal-value" style="display:flex;align-items:center;justify-content:center;margin:10px;background:transparent;" @submit.prevent="addCaller">
            <div class="u-input-text-inputs"><input class="u-input callerid-tab-inputs" placeholder="Inserisci un nickname" type="text" v-model="callerInput" required></div>
            <div class="u-input-text-inputs"><button type="submit" class="u-button u-button-primary">Aggiungi</button></div>
        </form>
        <div v-if="error" class="callerid-error">{{ error }}</div>
        <table v-if="callerList.length > 0" class="kiwi-callerlist-table">
            <tr v-for="nick of callerList" :key="'caller_'+nick">
                <td>{{ nick }}</td>
                <td>
                    <button type="button" class="u-button-primary callerid-button" @click="removeCaller(nick)">Rimuovi</button>
                </td>
            </tr>
        </table>
        <span v-else class="kiwi-callerlist-empty">La lista CallerID è vuota.</span>
    </div>
</template>

<script>

    export default {
        template: '#callerid-list',
        props: ['network', 'callerID'],
        data() {
            return {
                callerInput: '',
                error: '',
            };
        },
        computed: {
            callerList() {
                return Object.values(this.callerID.allowList);
            },
        },
        mounted() {
            kiwi.on('irc.raw.456', (command, event, network) => {
                this.error = "⚠ La tua Caller ID whitelist è piena!";
            });
            kiwi.on('irc.raw.457', (command, event, network) => {
                this.error = "⚠ " + event.params[1] + " è già presente nella tua whitelist!";
            });
            this.callerID.updateList();
        },
        methods: {
            addCaller() {
                this.callerID.addNick(this.callerInput);
                this.callerInput = '';
            },
            removeCaller(nick) {
                this.callerID.removeNick(nick);
            },
        }
    };
</script>