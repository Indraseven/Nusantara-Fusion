// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SapaNusantara {
    string public pesan;
    address public owner;

    // Event agar bisa dipantau di Explorer
    event PesanBaru(string pesanLama, string pesanBaru, address pengirim);

    constructor(string memory _pesanAwal) {
        pesan = _pesanAwal;
        owner = msg.sender;
    }

    // Fungsi untuk mengubah pesan (Tulis ke Blockchain)
    function ubahPesan(string memory _pesanBaru) public {
        string memory pesanLama = pesan;
        pesan = _pesanBaru;
        emit PesanBaru(pesanLama, _pesanBaru, msg.sender);
    }
}

