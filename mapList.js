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
//mapList.push(new Map(['jump_','jump_',''], 'assets/maps/', '', '', '', 'https://tempus2.xyz/maps/'));
mapList.push(new Map(['jump_spaghetti_v2', 'jump_spaghetti', 'spaghetti'], 'assets/maps/1/', 'Soldier', 3, 'sitood', 'https://tempus2.xyz/maps/jump_spaghetti_v2'));
mapList.push(new Map(['jump_undergrowth_zip','jump_undergrowth','undergrowth'], 'assets/maps/2', 'Soldier', '3', 'Seras', 'https://tempus2.xyz/maps/jump_undergrowth_zip'));
mapList.push(new Map(['jump_speed','speed'], 'assets/maps/3', 'Demo', '3', 'Aznbob', 'https://tempus2.xyz/maps/jump_speed'));
mapList.push(new Map(['jump_shunix_v2','jump_shunix','shunix'], 'assets/maps/4', 'Soldier', '3', 'Shunix', 'https://tempus2.xyz/maps/jump_shunix_v2'));
mapList.push(new Map(['jump_estrogen_a4','jump_estrogen','estrogen'], 'assets/maps/5', 'Soldier / Demo', 'T3 / T6', 'Exile', 'https://tempus2.xyz/maps/jump_estrogen_a4'));