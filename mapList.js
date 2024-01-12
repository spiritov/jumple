class Map {
    constructor(name, image_path, intended_class, tier, author, link) {
        this.name = name;
        this.image_path = image_path;
        this.intended_class = intended_class;
        this.tier = tier;
        this.author = author;
        this.link = link;
    }

}

//map = day - 1
var mapList = [];
//mapList.push(new Map['jump_','jump_',''], 'assets/maps/', '', '', '', 'https://tempus2.xyz/maps/'));
mapList.push(new Map(['jump_spaghetti_v2', 'jump_spaghetti', 'spaghetti'], 'assets/maps/1/', 'Soldier', 3, 'sitood', 'https://tempus2.xyz/maps/jump_spaghetti_v2'));