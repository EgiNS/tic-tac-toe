// eventListener agar semua html atau DOM dijanlankan terlebih dulu
window.addEventListener('DOMContentLoaded', () => {
    //dapatkan elemen yang dibutuhkan dengan DOM selection
    const squares = Array.from(document.querySelectorAll('.square'));
    const resetButton = document.querySelector('#reset');
    const resetModal = document.querySelector('#resetModal');
    const modal = document.getElementById("myModal");
    const close = document.querySelector('.close');
    const congrats = document.getElementById('congrats');
    const winner = document.getElementById("winner");
    const emoji = document.querySelector('.emoji');
    const Xturn = document.querySelector('.X-turn');
    const Oturn = document.querySelector('.O-turn');

    // declare variabel yang dibutuhkan
    let board = ['', '', '', '', '', '', '', '', '']; //board yang nantinya akan diisi nilai X atau O
    let currentPlayer = 'X';
    let isGameActive = true;

    // declare variabel untuk hasil akhir game
    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    // gambaran index pada board
    //     [0] [1] [2]
    //     [3] [4] [5]
    //     [6] [7] [8]

    // kondisi ketika ada pemenang
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], //satu baris semuanya terisi
        [0, 3, 6], [1, 4, 7], [2, 5, 8], //satu kolom semuanya terisi
        [0, 4, 8], [2, 4, 6] //diagonal semuanya terisi
    ];

    // fungsi untuk menentukan hasil akhir dari game
    function handleResultValidation() {
        let roundWon = false;
        // akan dilakukan looping pada array winningConditions untuk melihat apakah salah satu syarat pemenang sudah terpenuhi
        // syarat pemenang yaitu salah satu winningConditions terisi dengan karakter (X atau O) yang sama
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            //variabel a,b,c akan memuat karakter(X atau O) yang tersimpan pada board sesuai index pada winCondition
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            // jika dari a, b, atau c masih belum terisi atau string kosong maka lanjut ke kondisi selanjutnya
            if (a === '' || b === '' || c === '') {
                continue;
            } 
            // jika karakter dari a, b, dan c semuanya sama, maka syarat pemenang terpenuhi
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        // jika roundWon = true atau sudah ada pemenang, panggil fungsi annouce untuk mengumumkan pemenang
        if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON)
            isGameActive = false;
            return;
        }

        // jika semua board tidak memuat string kosong lagi atau sudah terisi semuanya dan roundWon = false, maka akan di announce seri
        if (!board.includes(''))
            announce(TIE);
    }

    // fungsi untuk mengumumkan hasil akhir game berdasarkan parameter type
    const announce = (type) => {
        switch(type){
            case PLAYERO_WON:
                winner.innerHTML = 'Player <span class="playerO">O</span> Won';
                congrats.innerHTML = 'CONGRATULATIONS!'
                emoji.innerHTML = '🎉';
                confetti();
                break;
            case PLAYERX_WON:
                winner.innerHTML = 'Player <span class="playerX">X</span> Won';
                congrats.innerHTML = 'CONGRATULATIONS!'
                emoji.innerHTML = '🎉';
                confetti();
                break;
            case TIE:
                winner.innerHTML = 'TIE';
                congrats.innerHTML = '';
                emoji.innerHTML = '⚖️';
        }
        modal.style.visibility = "visible";
    }

    // menutup modal saat mengklik button close pada pengumuman hasil akhir game
    close.onclick = function() {
        modal.style.visibility = "hidden";
    }

    // menutup modal saat mengklik button reset pada pengumuman hasil akhir game
    resetModal.onclick = function() {
        modal.style.visibility = "hidden";
    }

    // menutup modal saat mengklik dimana saja pada pengumuman hasil akhir game
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.visibility = "hidden";
        }
    }

    // fungsi agar user hanya dapat bermain di square yang kosong
    // jika square sudah terisi dengan X atau P akan direturn false
    const isValidAction = (square) => {
        if (square.innerText === 'X' || square.innerText === 'O') {
            return false;
        } else {
            return true;
        }       
    }

    // fungsi untuk mengupdate board dengan karakter sesuai index yang diklik user
    const updateBoard = (index) => {
        board[index] = currentPlayer;
    }

    // mengganti giliran player dan tampilan UI current player
    // jika currentPlayer saat ini O, maka currentPlayer selanjutnya adalah X. Begitu juga sebaliknya
    const changePlayer = () => {
        if (currentPlayer == 'O') {
            currentPlayer = 'X'
            Oturn.classList.remove('O-active');
            Xturn.classList.add('X-active');
        } else {
            currentPlayer = 'O'
            Xturn.classList.remove('X-active');
            Oturn.classList.add('O-active');
        }
    }

    // fungsi yang akan dipanggil ketika user mengklik salah satu square
    // parameter square untuk mengganti tampilan UI dengan X atau O dan index untuk update nilai pada array board
    const userAction = (square, index) => {
        if(isValidAction(square) && isGameActive) {
            square.innerText = currentPlayer; //mengupdate tampilan square pada UI dengan currentPlayer
            square.classList.add(`player${currentPlayer}`); //menambahkan class pada square dengan currentPlayer (playerX atau playerO)
            updateBoard(index); //panggil fungsi updateBoard yang akan mengupdate board dengan currentPlayer sesuai indexnya
            handleResultValidation(); //panggil handleResultValidation untuk melihat hasil akhir game, apakah sudah ada pemenang atau belum
            changePlayer(); //ganti giliran pemain atau currentPlayer
        }
    }

    // fungsi untuk reset game
    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        // announcer.classList.add('hide');
        modal.style.visibility = "hidden";

        // karena game dimulai dengan X, maka jika currentPlayer = O diganti dengan X
        if (currentPlayer === 'O') {
            changePlayer();
        }

        // hapus tampilan karakter pada UI dan hapus isi array square
        squares.forEach(square => {
            square.innerText = '';
            square.classList.remove('playerX');
            square.classList.remove('playerO');
        })
    }

    //ketika salah satu square diklik akan dipanggil fungsi userAction
    squares.forEach((square, index) => {
        square.addEventListener('click', () => userAction(square, index));
    });

    resetButton.addEventListener('click', resetBoard);
    resetModal.addEventListener('click', resetBoard);
})