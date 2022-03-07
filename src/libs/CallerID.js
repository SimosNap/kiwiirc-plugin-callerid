export default {
    data() {
        return {
            allowList: {},
            allowCache: [],
            updating: false,
            lastUpdate: 0,
        };
    },
    created() {
        kiwi.on('irc.raw.281', this.handle281);
        kiwi.on('irc.raw.282', this.handle282);
    },
    methods: {
        updateList() {
            if (this.updating) {
                return;
            }
            this.allowCache.length = 0;
            this.updating = true;

            kiwi.state.getActiveNetwork().ircClient.raw('ACCEPT', '*');
        },
        addNick(nick) {
            kiwi.state.getActiveNetwork().ircClient.raw('ACCEPT', '+' + nick);
            this.updateList();
        },
        removeNick(nick) {
            kiwi.state.getActiveNetwork().ircClient.raw('ACCEPT', '-' + nick);
            this.updateList();
        },
        hasNick(nick) {
            return Object.keys(this.allowList).includes(nick.toUpperCase());
        },
        handle281(command, event, network) {
            // console.log('irc.raw.281', event);
            this.allowCache.push(event.params[1]);
        },
        handle282(command, event, network) {
            // console.log('irc.raw.282', event);
            const newAllowList = Object.create(null);
            for (const nick of this.allowCache) {
                // add list from event
                newAllowList[nick.toUpperCase()] = nick;
            }
            kiwi.Vue.set(this, 'allowList', newAllowList);

            this.allowCache.length = 0;
            this.updating = false;
            this.lastUpdate = Date.now();
        },
    },
};
