Meteor.startup(() => {
    setTimeOffset();
});

Template.Clock.onCreated(() => {
    Meteor.setInterval(() => {
        serverClock.set(formatDate(new Date(getServerTime())));
        clientClock.set(formatDate(new Date()));
    }, 500);
});

let serverClock = new ReactiveVar(new Date());
let clientClock = new ReactiveVar(new Date());
let serverTimeOffset = new ReactiveVar(0);

function setTimeOffset() {
    Meteor.call('getServerTime', (err, serverTime) => {
        let localTime = (new Date).getTime();
        let timeOffset = serverTime - localTime;
        console.log(timeOffset);
        serverTimeOffset.set(timeOffset);
    })
}

function formatDate(date) {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function getServerTime() {
    return (new Date).getTime() + serverTimeOffset.get();
}

Template.Clock.helpers({
    serverTime: () => {
        return serverClock.get();
    },

    clientTime: () => {
        return clientClock.get();
    }
});