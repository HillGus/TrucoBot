const ALREADY_PLAYING = 1;
const ADDED = 2;

const Game = function(channel) {

    const players = [];
    var playing = false;
    var deck = []
    var qnt_cartas = 1;

    const naipes = ['♥', '♦', '♣', '♠'];
    const numeros = ['1', '2', '3', '4', '5', '6', '7', '10', '11', '12'];
    
    naipes.map(
        naipe => {
            return numeros.map(numero => naipe + numero)
        }
    ).forEach(cardGroup => deck = deck.concat(cardGroup));

    this.isPlaying = function(name) {

        return players.some(player => player.name() === name);
    }

    this.addPlayer = function(name) {

        const player_exists = players.some(player => player.name() === name);

        if (playing)
            return 1;

        if (!player_exists) {
            players.push(new Player(name));
            return 2;
        } else {
            return 0;
        }
    }

    this.removePlayer = function(name) {

        players.forEach((player, index) => {
                players.splice(index, 1);
        });
    }
    
    this.start = function() {

        this.shuffleDeck();
        this.darCartas();
        playing = true;
    }

    this.shuffleDeck = function() {

        for (var i = 0; i < deck.length; i++) {
            const randomIndex = Math.floor(Math.random() * deck.length);
            var temp = deck[i];
            deck[i] = deck[randomIndex];
            deck[randomIndex] = temp;
        }
    }

    this.darCartas = function() {

        if (qnt_cartas * players.length > deck.length)
            qnt_cartas = 1;

        var deck_copy = this.deck();

        for (var k = 0; k < qnt_cartas; k++) {
            players.forEach(player => {

                player.addCard(deck_copy.pop());
            });
        }

        qnt_cartas++;
    }

    this.deck = function() {

        return deck.slice();
    }

    this.players = function() {

        return players.slice();
    }

    this.channel = function() {

        return channel.toString();
    }
}

const Player = function(name) {

    const cards_in_hand = [];
    var erros = 0;
    var quantas_leva = 0;
    var quantas_levou = 0;

    const errou = function(qntErros) {

        erros += qntErros;
    }

    this.addCard = function(card) {

        cards_in_hand.push(card);
    }

    this.playCard = function(index) {

        index = parseInt(index);

        if (!index)
            throw {
                name: 'Invalid Input',
                message: 'O valor recebido não é um número.'
            };

        if (index <= cards_in_hand.length && index > 0) {

            return cards_in_hand.splice(index - 1, 1)[0];
        }

        throw {
            name: 'Invalid Input',
            message: 'O número recebido não está dentro das opções.'
        };
    }

    this.levou = function() {

        quantas_levou++;
    }

    this.leva = function(qnt) {

        if (qnt) {

            qnt = parseInt(qnt);

            if (qnt)
                quantas_leva = qnt;
            else
            throw {
                name: 'Invalid Input',
                message: 'O valor recebido não é um número'
            };
        } else {

            return quantas_leva;
        }
    }

    this.calcularErros = function() {

        errou(Math.abs(quantas_leva - quantas_levou));
    }

    this.name = function() {
       return name.toString();
    }

    this.hand = function() {

        return cards_in_hand.slice();
    }
}



module.exports = {
    Game: Game,
    ALREADY_PLAYING: ALREADY_PLAYING,
    ADDED: ADDED
}