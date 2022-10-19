module.exports = (sotien, noidung, magd, setting) => {
    try {
        
        if (sotien < setting.tile.min || sotien > setting.tile.max) {
            return 0
        }
        let nd = noidung.replaceAll(" ", "")
        nd = nd.toLowerCase()
        let tiencuoc = 0;
        magd = magd + ""
        let s1so = magd.substring(magd.length - 1, magd.length)
        let s2so = magd.substring(magd.length - 2, magd.length)
        let s3so = magd.substring(magd.length - 3, magd.length)
        s1so = Number(s1so)
        s2so = Number(s2so)
        s3so = Number(s3so)
        let num3 = s3so
        let total3num = 0
        total3num = total3num + num3 % 10
        num3 = num3 / 10
        while (num3 > 0) {
            total3num = Math.floor(total3num + num3 % 10)
            num3 = num3 / 10
        }
        if (nd == "C" || nd == "L" || nd == "c" || nd == "l") {
            if ((s1so % 2 == 0 && s1so != 0 && (nd == "c" || nd == "C")) || (s1so % 2 != 0 && s1so != 9 && (nd == "l" || nd == "L"))) {
                tiencuoc = sotien * setting.tile.chanle
            }
        }
        else if (nd == "A" || nd == "B" || nd == "a" || nd == "b") {
            if ((s1so % 2 == 0 && s1so != 0 && (nd == "a" || nd == "A")) || (s1so % 2 != 0 && s1so != 9 && (nd == "b" || nd == "B"))) {
                tiencuoc = sotien * setting.tile.chanle
            }
        }
        else if (nd == "T" || nd == "X" || nd == "t" || nd == "x") {
            if ((s1so > 4 && s1so < 9 && (nd == "T" || nd == "t")) || (s1so > 0 && s1so < 5 && (nd == "x" || nd == "X"))) {
                tiencuoc = sotien * setting.tile.taixiu
            }
        }
        else if (nd == "A2" || nd == "B2" || nd == "a2" || nd == "b2") {
            if (((nd == "A2" || nd == "a2") && s1so % 2 == 0) || ((nd == "b2" || nd == "B2") && s1so % 2 != 0)) {
                tiencuoc = sotien * setting.tile.chanle2
            }
        }
        else if (nd == "C2" || nd == "L2" || nd == "c2" || nd == "l2") {
            if (((nd == "C2" || nd == "c2") && s1so % 2 == 0) || ((nd == "l2" || nd == "L2") && s1so % 2 != 0)) {
                tiencuoc = sotien * setting.tile.chanle2
            }
        }
        else if (nd == "T2" || nd == "X2" || nd == "t2" || nd == "x2") {
            if ((s1so > 4 && s1so < 10 && (nd == "T2" || nd == "t2")) || (s1so > -1 && s1so < 5 && (nd == "x2" || nd == "X2"))) {
                tiencuoc = sotien * setting.tile.chanle2
            }
        }
        else if ((nd == "N1" || nd == "n1") && (s1so == 1 || s1so == 2 || s1so == 3)) {
            tiencuoc = sotien * setting.tile.phan3
        }
        else if ((nd == "N2" || nd == "n2") && (s1so == 4 || s1so == 5 || s1so == 6)) {
            tiencuoc = sotien * setting.tile.phan3
        }
        else if ((nd == "N3" || nd == "n3") && (s1so == 7 || s1so == 8 || s1so == 9)) {
            tiencuoc = sotien * setting.tile.phan3
        }
        else if ((nd == "G3" || nd == "g3") && (s2so == 02 || s2so == 13 || s2so == 17 || s2so == 19 || s2so == 21 || s2so == 29 || s2so == 35 || s2so == 37 || s2so == 47 || s2so == 49 || s2so == 51 || s2so == 54 || s2so == 57 || s2so == 63 || s2so == 64 || s2so == 74 || s2so == 83 || s2so == 91 || s2so == 95 || s2so == 96)) {
            tiencuoc = sotien * setting.tile.gap3type1
        }
        else if ((nd == "G3" || nd == "g3") && (s2so == 66 || s2so == 99)) {
            tiencuoc = sotien * setting.tile.gap3type2
        }
        else if ((nd == "G3" || nd == "g3") && (s3so == 123 || s3so == 234 || s3so == 456 || s3so == 678 || s3so == 789)) {
            tiencuoc = sotien * setting.tile.gap3type3
        }
        else if ((nd == "s" || nd == "S") && (total3num == 7 || total3num == 17 || total3num == 27)) {
            tiencuoc = sotien * setting.tile.tong3sotype1
        }
        else if ((nd == "s" || nd == "S") && (total3num == 8 || total3num == 18)) {
            tiencuoc = sotien * setting.tile.tong3sotype2
        }
        else if ((nd == "s" || nd == "S") && (total3num == 9 || total3num == 19)) {
            tiencuoc = sotien * setting.tile.tong3sotype3
        }
        else if ((nd == "cx") && (s1so == 0 || s1so == 2 || s1so == 4)) {
            tiencuoc = sotien * setting.tile.xien
        }
        else if ((nd == "lt") && (s1so == 5 || s1so == 7 || s1so == 9)) {
            tiencuoc = sotien * setting.tile.xien
        }
        else if ((nd == "ct") && (s1so == 6 || s1so == 8)) {
            tiencuoc = sotien * setting.tile.xien
        }
        else if ((nd == "lx") && (s1so == 1 || s1so == 3)) {
            tiencuoc = sotien * setting.tile.xien
        }
        else if ((nd == "d0") && (s1so == 0)) {
            tiencuoc = sotien * setting.tile.doanso
        }
        else if ((nd == "d1") && (s1so == 1)) {
            tiencuoc = sotien * setting.tile.doanso
        }
        else if ((nd == "d2") && (s1so == 2)) {
            tiencuoc = sotien * setting.tile.doanso
        }
        else if ((nd == "d3") && (s1so == 3)) {
            tiencuoc = sotien * setting.tile.doanso
        }
        else if ((nd == "d4") && (s1so == 4)) {
            tiencuoc = sotien * setting.tile.doanso
        }
        else if ((nd == "d5") && (s1so == 5)) {
            tiencuoc = sotien * setting.tile.doanso
        }
        else if ((nd == "d6") && (s1so == 6)) {
            tiencuoc = sotien * setting.tile.doanso
        }
        else if ((nd == "d7") && (s1so == 7)) {
            tiencuoc = sotien * setting.tile.doanso
        }
        else if ((nd == "d8") && (s1so == 8)) {
            tiencuoc = sotien * setting.tile.doanso
        }
        else if ((nd == "d9") && (s1so == 9)) {
            tiencuoc = sotien * setting.tile.doanso
        }
       // console.log(noidung, magd, tiencuoc)
        return Math.round(tiencuoc)
    } catch { return 0 }
}