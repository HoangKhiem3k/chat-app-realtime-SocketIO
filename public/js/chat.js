
const socket = io();
const messageBlock = $('#messages')
socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit("join", {
        params: $.deparam(window.location.search)
    })
});
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

const scrollToBottom = (node) => {
    node.scrollTop = node.scrollHeight;
}

socket.on('newMessage', (message) => {
    // console.log('New message', message);
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $('#messages').append(html);


    // const formattedTime = moment(message.createdAt).format('h:mm A');
    // const li = $('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // $('#messages').append(li);

})



socket.on('newLocationMessage', (message) => {
    let template = $('#location-message-template').html();
    let html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: moment(message.createdAt).format('h:mm a')

    })
    $('#messages').append(html);
    $(function () {
        $("html, body").animate({
            scrollTop: $('html, body').get(0).scrollHeight
        }, 2000);
    });
    // const formattedTime = moment(message.createdAt).format('h:mm A');
    // const li = $('<li></li>');
    // const a = $('<a target="_blank">My current location</a>');
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    // $('#messages').append(li);
})

$('#message-form').on('submit', (event) => {
    event.preventDefault();

    socket.emit('createMessage', {
        from: $.deparam(window.location.search).name,
        text: $('[name=message]').val()    // get value from input which have name = message
    }, (data) => {
        console.log("Message sent", data);
        $('[name=message]').val("")
    })
})

$('#send-location').on('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    } else {
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit("createLocationMessage", {
                from: $.deparam(window.location.search).name,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
        }, () => {
            alert('Unable to fetch location');
        })
    }
})

// List users in room
socket.on('usersInRoom', (message) => {
    let users = message.usersInRoom
    console.log('user in room: ', users)
    let ol = $('<ol></ol>')
    users.forEach(user => {
        let li = $('<li></li>')
        li.text(user.name)
        ol.append(li)
    })
    $('#users').html(ol)

})


$(document).scrollTop($(document).height())