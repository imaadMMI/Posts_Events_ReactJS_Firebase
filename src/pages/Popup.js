import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  db,
  auth,
} from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase-config"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "../App.css";

const vulgarWords = [
  "abbo",
  "abo",
  "abortion",
  "abuse",
  "addict",
  "addicts",
  "adult",
  "africa",
  "african",
  "alla",
  "allah",
  "alligatorbait",
  "amateur",
  "american",
  "anal",
  "analannie",
  "analsex",
  "angie",
  "angry",
  "anus",
  "arab",
  "arabs",
  "areola",
  "argie",
  "aroused",
  "arse",
  "arsehole",
  "asian",
  "ass",
  "assassin",
  "assassinate",
  "assassination",
  "assault",
  "assbagger",
  "assblaster",
  "assclown",
  "asscowboy",
  "asses",
  "assfuck",
  "assfucker",
  "asshat",
  "asshole",
  "assholes",
  "asshore",
  "assjockey",
  "asskiss",
  "asskisser",
  "assklown",
  "asslick",
  "asslicker",
  "asslover",
  "assman",
  "assmonkey",
  "assmunch",
  "assmuncher",
  "asspacker",
  "asspirate",
  "asspuppies",
  "assranger",
  "asswhore",
  "asswipe",
  "athletesfoot",
  "attack",
  "australian",
  "babe",
  "babies",
  "backdoor",
  "backdoorman",
  "backseat",
  "badfuck",
  "balllicker",
  "balls",
  "ballsack",
  "banging",
  "baptist",
  "barelylegal",
  "barf",
  "barface",
  "barfface",
  "bast",
  "bastard ",
  "bazongas",
  "bazooms",
  "beaner",
  "beast",
  "beastality",
  "beastial",
  "beastiality",
  "beatoff",
  "beat-off",
  "beatyourmeat",
  "beaver",
  "bestial",
  "bestiality",
  "bi",
  "biatch",
  "bible",
  "bicurious",
  "bigass",
  "bigbastard",
  "bigbutt",
  "bigger",
  "bisexual",
  "bi-sexual",
  "bitch",
  "bitcher",
  "bitches",
  "bitchez",
  "bitchin",
  "bitching",
  "bitchslap",
  "bitchy",
  "biteme",
  "black",
  "blackman",
  "blackout",
  "blacks",
  "blind",
  "blow",
  "blowjob",
  "boang",
  "bogan",
  "bohunk",
  "bollick",
  "bollock",
  "bomb",
  "bombers",
  "bombing",
  "bombs",
  "bomd",
  "bondage",
  "boner",
  "bong",
  "boob",
  "boobies",
  "boobs",
  "booby",
  "boody",
  "boom",
  "boong",
  "boonga",
  "boonie",
  "booty",
  "bootycall",
  "bountybar",
  "bra",
  "brea5t",
  "breast",
  "breastjob",
  "breastlover",
  "breastman",
  "brothel",
  "bugger",
  "buggered",
  "buggery",
  "bullcrap",
  "bulldike",
  "bulldyke",
  "bullshit",
  "bumblefuck",
  "bumfuck",
  "bunga",
  "bunghole",
  "buried",
  "burn",
  "butchbabes",
  "butchdike",
  "butchdyke",
  "butt",
  "buttbang",
  "butt-bang",
  "buttface",
  "buttfuck",
  "butt-fuck",
  "buttfucker",
  "butt-fucker",
  "buttfuckers",
  "butt-fuckers",
  "butthead",
  "buttman",
  "buttmunch",
  "buttmuncher",
  "buttpirate",
  "buttplug",
  "buttstain",
  "byatch",
  "cacker",
  "cameljockey",
  "cameltoe",
  "canadian",
  "cancer",
  "carpetmuncher",
  "carruth",
  "catholic",
  "catholics",
  "cemetery",
  "chav",
  "cherrypopper",
  "chickslick",
  "children's",
  "chin",
  "chinaman",
  "chinamen",
  "chinese",
  "chink",
  "chinky",
  "choad",
  "chode",
  "christ",
  "christian",
  "church",
  "cigarette",
  "cigs",
  "clamdigger",
  "clamdiver",
  "clit",
  "clitoris",
  "clogwog",
  "cocaine",
  "cock",
  "cockblock",
  "cockblocker",
  "cockcowboy",
  "cockfight",
  "cockhead",
  "cockknob",
  "cocklicker",
  "cocklover",
  "cocknob",
  "cockqueen",
  "cockrider",
  "cocksman",
  "cocksmith",
  "cocksmoker",
  "cocksucer",
  "cocksuck ",
  "cocksucked ",
  "cocksucker",
  "cocksucking",
  "cocktail",
  "cocktease",
  "cocky",
  "cohee",
  "coitus",
  "color",
  "colored",
  "coloured",
  "commie",
  "communist",
  "condom",
  "conservative",
  "conspiracy",
  "coolie",
  "cooly",
  "coon",
  "coondog",
  "copulate",
  "cornhole",
  "corruption",
  "cra5h",
  "crabs",
  "crack",
  "crackpipe",
  "crackwhore",
  "crack-whore",
  "crap",
  "crapola",
  "crapper",
  "crappy",
  "crash",
  "creamy",
  "crime",
  "crimes",
  "criminal",
  "criminals",
  "crotch",
  "crotchjockey",
  "crotchmonkey",
  "crotchrot",
  "cum",
  "cumbubble",
  "cumfest",
  "cumjockey",
  "cumm",
  "cummer",
  "cumming",
  "cumquat",
  "cumqueen",
  "cumshot",
  "cunilingus",
  "cunillingus",
  "cunn",
  "cunnilingus",
  "cunntt",
  "cunt",
  "cunteyed",
  "cuntfuck",
  "cuntfucker",
  "cuntlick ",
  "cuntlicker ",
  "cuntlicking ",
  "cuntsucker",
  "cybersex",
  "cyberslimer",
  "dago",
  "dahmer",
  "dammit",
  "damn",
  "damnation",
  "damnit",
  "darkie",
  "darky",
  "datnigga",
  "dead",
  "deapthroat",
  "death",
  "deepthroat",
  "defecate",
  "dego",
  "demon",
  "deposit",
  "desire",
  "destroy",
  "deth",
  "devil",
  "devilworshipper",
  "dick",
  "dickbrain",
  "dickforbrains",
  "dickhead",
  "dickless",
  "dicklick",
  "dicklicker",
  "dickman",
  "dickwad",
  "dickweed",
  "diddle",
  "die",
  "died",
  "dies",
  "dike",
  "dildo",
  "dingleberry",
  "dink",
  "dipshit",
  "dipstick",
  "dirty",
  "disease",
  "diseases",
  "disturbed",
  "dive",
  "dix",
  "dixiedike",
  "dixiedyke",
  "doggiestyle",
  "doggystyle",
  "dong",
  "doodoo",
  "doo-doo",
  "doom",
  "dope",
  "dragqueen",
  "dragqween",
  "dripdick",
  "drug",
  "drunk",
  "drunken",
  "dumb",
  "dumbass",
  "dumbbitch",
  "dumbfuck",
  "dyefly",
  "dyke",
  "easyslut",
  "eatballs",
  "eatme",
  "eatpussy",
  "ecstacy",
  "ejaculate",
  "ejaculated",
  "ejaculating ",
  "ejaculation",
  "enema",
  "enemy",
  "erect",
  "erection",
  "ero",
  "escort",
  "ethiopian",
  "ethnic",
  "european",
  "evl",
  "excrement",
  "execute",
  "executed",
  "execution",
  "executioner",
  "explosion",
  "facefucker",
  "faeces",
  "fag",
  "fagging",
  "faggot",
  "fagot",
  "failed",
  "failure",
  "fairies",
  "fairy",
  "faith",
  "fannyfucker",
  "fart",
  "farted ",
  "farting ",
  "farty ",
  "fastfuck",
  "fat",
  "fatah",
  "fatass",
  "fatfuck",
  "fatfucker",
  "fatso",
  "fckcum",
  "fear",
  "feces",
  "felatio ",
  "felch",
  "felcher",
  "felching",
  "fellatio",
  "feltch",
  "feltcher",
  "feltching",
  "fetish",
  "fight",
  "filipina",
  "filipino",
  "fingerfood",
  "fingerfuck ",
  "fingerfucked ",
  "fingerfucker ",
  "fingerfuckers",
  "fingerfucking ",
  "fire",
  "firing",
  "fister",
  "fistfuck",
  "fistfucked ",
  "fistfucker ",
  "fistfucking ",
  "fisting",
  "flange",
  "flasher",
  "flatulence",
  "floo",
  "flydie",
  "flydye",
  "fok",
  "fondle",
  "footaction",
  "footfuck",
  "footfucker",
  "footlicker",
  "footstar",
  "fore",
  "foreskin",
  "forni",
  "fornicate",
  "foursome",
  "fourtwenty",
  "fraud",
  "freakfuck",
  "freakyfucker",
  "freefuck",
  "fu",
  "fubar",
  "fuc",
  "fucck",
  "fuck",
  "fucka",
  "fuckable",
  "fuckbag",
  "fuckbuddy",
  "fucked",
  "fuckedup",
  "fucker",
  "fuckers",
  "fuckface",
  "fuckfest",
  "fuckfreak",
  "fuckfriend",
  "fuckhead",
  "fuckher",
  "fuckin",
  "fuckina",
  "fucking",
  "fuckingbitch",
  "fuckinnuts",
  "fuckinright",
  "fuckit",
  "fuckknob",
  "fuckme ",
  "fuckmehard",
  "fuckmonkey",
  "fuckoff",
  "fuckpig",
  "fucks",
  "fucktard",
  "fuckwhore",
  "fuckyou",
  "fudgepacker",
  "fugly",
  "fuk",
  "fuks",
  "funeral",
  "funfuck",
  "fungus",
  "fuuck",
  "gangbang",
  "gangbanged ",
  "gangbanger",
  "gangsta",
  "gatorbait",
  "gay",
  "gaymuthafuckinwhore",
  "gaysex ",
  "geez",
  "geezer",
  "geni",
  "genital",
  "german",
  "getiton",
  "gin",
  "ginzo",
  "gipp",
  "girls",
  "givehead",
  "glazeddonut",
  "gob",
  "god",
  "godammit",
  "goddamit",
  "goddammit",
  "goddamn",
  "goddamned",
  "goddamnes",
  "goddamnit",
  "goddamnmuthafucker",
  "goldenshower",
  "gonorrehea",
  "gonzagas",
  "gook",
  "gotohell",
  "goy",
  "goyim",
  "greaseball",
  "gringo",
  "groe",
  "gross",
  "grostulation",
  "gubba",
  "gummer",
  "gun",
  "gyp",
  "gypo",
  "gypp",
  "gyppie",
  "gyppo",
  "gyppy",
  "hamas",
  "handjob",
  "hapa",
  "harder",
  "hardon",
  "harem",
  "headfuck",
  "headlights",
  "hebe",
  "heeb",
  "hell",
  "henhouse",
  "heroin",
  "herpes",
  "heterosexual",
  "hijack",
  "hijacker",
  "hijacking",
  "hillbillies",
  "hindoo",
  "hiscock",
  "hitler",
  "hitlerism",
  "hitlerist",
  "hiv",
  "ho",
  "hobo",
  "hodgie",
  "hoes",
  "hole",
  "holestuffer",
  "homicide",
  "homo",
  "homobangers",
  "homosexual",
  "honger",
  "honk",
  "honkers",
  "honkey",
  "honky",
  "hook",
  "hooker",
  "hookers",
  "hooters",
  "hore",
  "hork",
  "horn",
  "horney",
  "horniest",
  "horny",
  "horseshit",
  "hosejob",
  "hoser",
  "hostage",
  "hotdamn",
  "hotpussy",
  "hottotrot",
  "hummer",
  "husky",
  "hussy",
  "hustler",
  "hymen",
  "hymie",
  "iblowu",
  "idiot",
  "ikey",
  "illegal",
  "incest",
  "insest",
  "intercourse",
  "interracial",
  "intheass",
  "inthebuff",
  "israel",
  "israeli",
  "israel's",
  "italiano",
  "itch",
  "jackass",
  "jackoff",
  "jackshit",
  "jacktheripper",
  "jade",
  "jap",
  "japanese",
  "japcrap",
  "jebus",
  "jeez",
  "jerkoff",
  "jesus",
  "jesuschrist",
  "jew",
  "jewish",
  "jiga",
  "jigaboo",
  "jigg",
  "jigga",
  "jiggabo",
  "jigger ",
  "jiggy",
  "jihad",
  "jijjiboo",
  "jimfish",
  "jism",
  "jiz ",
  "jizim",
  "jizjuice",
  "jizm ",
  "jizz",
  "jizzim",
  "jizzum",
  "joint",
  "juggalo",
  "jugs",
  "junglebunny",
  "kaffer",
  "kaffir",
  "kaffre",
  "kafir",
  "kanake",
  "kid",
  "kigger",
  "kike",
  "kill",
  "killed",
  "killer",
  "killing",
  "kills",
  "kink",
  "kinky",
  "kissass",
  "kkk",
  "knife",
  "knockers",
  "kock",
  "kondum",
  "koon",
  "kotex",
  "krap",
  "krappy",
  "kraut",
  "kum",
  "kumbubble",
  "kumbullbe",
  "kummer",
  "kumming",
  "kumquat",
  "kums",
  "kunilingus",
  "kunnilingus",
  "kunt",
  "ky",
  "kyke",
  "lactate",
  "laid",
  "lapdance",
  "latin",
  "lesbain",
  "lesbayn",
  "lesbian",
  "lesbin",
  "lesbo",
  "lez",
  "lezbe",
  "lezbefriends",
  "lezbo",
  "lezz",
  "lezzo",
  "liberal",
  "libido",
  "licker",
  "lickme",
  "lies",
  "limey",
  "limpdick",
  "limy",
  "lingerie",
  "liquor",
  "livesex",
  "loadedgun",
  "lolita",
  "looser",
  "loser",
  "lotion",
  "lovebone",
  "lovegoo",
  "lovegun",
  "lovejuice",
  "lovemuscle",
  "lovepistol",
  "loverocket",
  "lowlife",
  "lsd",
  "lubejob",
  "lucifer",
  "luckycammeltoe",
  "lugan",
  "lynch",
  "macaca",
  "mad",
  "mafia",
  "magicwand",
  "mams",
  "manhater",
  "manpaste",
  "marijuana",
  "mastabate",
  "mastabater",
  "masterbate",
  "masterblaster",
  "mastrabator",
  "masturbate",
  "masturbating",
  "mattressprincess",
  "meatbeatter",
  "meatrack",
  "meth",
  "mexican",
  "mgger",
  "mggor",
  "mickeyfinn",
  "mideast",
  "milf",
  "minority",
  "mockey",
  "mockie",
  "mocky",
  "mofo",
  "moky",
  "moles",
  "molest",
  "molestation",
  "molester",
  "molestor",
  "moneyshot",
  "mooncricket",
  "mormon",
  "moron",
  "moslem",
  "mosshead",
  "mothafuck",
  "mothafucka",
  "mothafuckaz",
  "mothafucked ",
  "mothafucker",
  "mothafuckin",
  "mothafucking ",
  "mothafuckings",
  "motherfuck",
  "motherfucked",
  "motherfucker",
  "motherfuckin",
  "motherfucking",
  "motherfuckings",
  "motherlovebone",
  "muff",
  "muffdive",
  "muffdiver",
  "muffindiver",
  "mufflikcer",
  "mulatto",
  "muncher",
  "munt",
  "murder",
  "murderer",
  "muslim",
  "naked",
  "narcotic",
  "nasty",
  "nastybitch",
  "nastyho",
  "nastyslut",
  "nastywhore",
  "nazi",
  "necro",
  "negro",
  "negroes",
  "negroid",
  "negro's",
  "nig",
  "niger",
  "nigerian",
  "nigerians",
  "nigg",
  "nigga",
  "niggah",
  "niggaracci",
  "niggard",
  "niggarded",
  "niggarding",
  "niggardliness",
  "niggardliness's",
  "niggardly",
  "niggards",
  "niggard's",
  "niggaz",
  "nigger",
  "niggerhead",
  "niggerhole",
  "niggers",
  "nigger's",
  "niggle",
  "niggled",
  "niggles",
  "niggling",
  "nigglings",
  "niggor",
  "niggur",
  "niglet",
  "nignog",
  "nigr",
  "nigra",
  "nigre",
  "nip",
  "nipple",
  "nipplering",
  "nittit",
  "nlgger",
  "nlggor",
  "nofuckingway",
  "nook",
  "nookey",
  "nookie",
  "noonan",
  "nooner",
  "nude",
  "nudger",
  "nuke",
  "nutfucker",
  "nymph",
  "ontherag",
  "oral",
  "orga",
  "orgasim ",
  "orgasm",
  "orgies",
  "orgy",
  "osama",
  "paki",
  "palesimian",
  "palestinian",
  "pansies",
  "pansy",
  "panti",
  "panties",
  "payo",
  "pearlnecklace",
  "peck",
  "pecker",
  "peckerwood",
  "pee",
  "peehole",
  "pee-pee",
  "peepshow",
  "peepshpw",
  "pendy",
  "penetration",
  "peni5",
  "penile",
  "penis",
  "penises",
  "penthouse",
  "period",
  "perv",
  "phonesex",
  "phuk",
  "phuked",
  "phuking",
  "phukked",
  "phukking",
  "phungky",
  "phuq",
  "pi55",
  "picaninny",
  "piccaninny",
  "pickaninny",
  "piker",
  "pikey",
  "piky",
  "pimp",
  "pimped",
  "pimper",
  "pimpjuic",
  "pimpjuice",
  "pimpsimp",
  "pindick",
  "piss",
  "pissed",
  "pisser",
  "pisses ",
  "pisshead",
  "pissin ",
  "pissing",
  "pissoff ",
  "pistol",
  "pixie",
  "pixy",
  "playboy",
  "playgirl",
  "pocha",
  "pocho",
  "pocketpool",
  "pohm",
  "polack",
  "pom",
  "pommie",
  "pommy",
  "poo",
  "poon",
  "poontang",
  "poop",
  "pooper",
  "pooperscooper",
  "pooping",
  "poorwhitetrash",
  "popimp",
  "porchmonkey",
  "porn",
  "pornflick",
  "pornking",
  "porno",
  "pornography",
  "pornprincess",
  "pot",
  "poverty",
  "premature",
  "pric",
  "prick",
  "prickhead",
  "primetime",
  "propaganda",
  "pros",
  "prostitute",
  "protestant",
  "pu55i",
  "pu55y",
  "pube",
  "pubic",
  "pubiclice",
  "pud",
  "pudboy",
  "pudd",
  "puddboy",
  "puke",
  "puntang",
  "purinapricness",
  "puss",
  "pussie",
  "pussies",
  "pussy",
  "pussycat",
  "pussyeater",
  "pussyfucker",
  "pussylicker",
  "pussylips",
  "pussylover",
  "pussypounder",
  "pusy",
  "quashie",
  "queef",
  "queer",
  "quickie",
  "quim",
  "ra8s",
  "rabbi",
  "racial",
  "racist",
  "radical",
  "radicals",
  "raghead",
  "randy",
  "rape",
  "raped",
  "raper",
  "rapist",
  "rearend",
  "rearentry",
  "rectum",
  "redlight",
  "redneck",
  "reefer",
  "reestie",
  "refugee",
  "reject",
  "remains",
  "rentafuck",
  "republican",
  "rere",
  "retard",
  "retarded",
  "ribbed",
  "rigger",
  "rimjob",
  "rimming",
  "roach",
  "robber",
  "roundeye",
  "rump",
  "russki",
  "russkie",
  "sadis",
  "sadom",
  "samckdaddy",
  "sandm",
  "sandnigger",
  "satan",
  "scag",
  "scallywag",
  "scat",
  "schlong",
  "screw",
  "screwyou",
  "scrotum",
  "scum",
  "semen",
  "seppo",
  "servant",
  "sex",
  "sexed",
  "sexfarm",
  "sexhound",
  "sexhouse",
  "sexing",
  "sexkitten",
  "sexpot",
  "sexslave",
  "sextogo",
  "sextoy",
  "sextoys",
  "sexual",
  "sexually",
  "sexwhore",
  "sexy",
  "sexymoma",
  "sexy-slim",
  "shag",
  "shaggin",
  "shagging",
  "shat",
  "shav",
  "shawtypimp",
  "sheeney",
  "shhit",
  "shinola",
  "shit",
  "shitcan",
  "shitdick",
  "shite",
  "shiteater",
  "shited",
  "shitface",
  "shitfaced",
  "shitfit",
  "shitforbrains",
  "shitfuck",
  "shitfucker",
  "shitfull",
  "shithapens",
  "shithappens",
  "shithead",
  "shithouse",
  "shiting",
  "shitlist",
  "shitola",
  "shitoutofluck",
  "shits",
  "shitstain",
  "shitted",
  "shitter",
  "shitting",
  "shitty ",
  "shoot",
  "shooting",
  "shortfuck",
  "showtime",
  "sick",
  "sissy",
  "sixsixsix",
  "sixtynine",
  "sixtyniner",
  "skank",
  "skankbitch",
  "skankfuck",
  "skankwhore",
  "skanky",
  "skankybitch",
  "skankywhore",
  "skinflute",
  "skum",
  "skumbag",
  "slant",
  "slanteye",
  "slapper",
  "slaughter",
  "slav",
  "slave",
  "slavedriver",
  "sleezebag",
  "sleezeball",
  "slideitin",
  "slime",
  "slimeball",
  "slimebucket",
  "slopehead",
  "slopey",
  "slopy",
  "slut",
  "sluts",
  "slutt",
  "slutting",
  "slutty",
  "slutwear",
  "slutwhore",
  "smack",
  "smackthemonkey",
  "smut",
  "snatch",
  "snatchpatch",
  "snigger",
  "sniggered",
  "sniggering",
  "sniggers",
  "snigger's",
  "sniper",
  "snot",
  "snowback",
  "snownigger",
  "sob",
  "sodom",
  "sodomise",
  "sodomite",
  "sodomize",
  "sodomy",
  "sonofabitch",
  "sonofbitch",
  "sooty",
  "sos",
  "soviet",
  "spaghettibender",
  "spaghettinigger",
  "spank",
  "spankthemonkey",
  "sperm",
  "spermacide",
  "spermbag",
  "spermhearder",
  "spermherder",
  "spic",
  "spick",
  "spig",
  "spigotty",
  "spik",
  "spit",
  "spitter",
  "splittail",
  "spooge",
  "spreadeagle",
  "spunk",
  "spunky",
  "squaw",
  "stagg",
  "stiffy",
  "strapon",
  "stringer",
  "stripclub",
  "stroke",
  "stroking",
  "stupid",
  "stupidfuck",
  "stupidfucker",
  "suck",
  "suckdick",
  "sucker",
  "suckme",
  "suckmyass",
  "suckmydick",
  "suckmytit",
  "suckoff",
  "suicide",
  "swallow",
  "swallower",
  "swalow",
  "swastika",
  "sweetness",
  "syphilis",
  "taboo",
  "taff",
  "tampon",
  "tang",
  "tantra",
  "tarbaby",
  "tard",
  "teat",
  "terror",
  "terrorist",
  "teste",
  "testicle",
  "testicles",
  "thicklips",
  "thirdeye",
  "thirdleg",
  "threesome",
  "threeway",
  "timbernigger",
  "tinkle",
  "tit",
  "titbitnipply",
  "titfuck",
  "titfucker",
  "titfuckin",
  "titjob",
  "titlicker",
  "titlover",
  "tits",
  "tittie",
  "titties",
  "titty",
  "tnt",
  "toilet",
  "tongethruster",
  "tongue",
  "tonguethrust",
  "tonguetramp",
  "tortur",
  "torture",
  "tosser",
  "towelhead",
  "trailertrash",
  "tramp",
  "trannie",
  "tranny",
  "transexual",
  "transsexual",
  "transvestite",
  "triplex",
  "trisexual",
  "trojan",
  "trots",
  "tuckahoe",
  "tunneloflove",
  "turd",
  "turnon",
  "twat",
  "twink",
  "twinkie",
  "twobitwhore",
  "uck",
  "uk",
  "unfuckable",
  "upskirt",
  "uptheass",
  "upthebutt",
  "urinary",
  "urinate",
  "urine",
  "usama",
  "uterus",
  "vagina",
  "vaginal",
  "vatican",
  "vibr",
  "vibrater",
  "vibrator",
  "vietcong",
  "violence",
  "virgin",
  "virginbreaker",
  "vomit",
  "vulva",
  "wab",
  "wank",
  "wanker",
  "wanking",
  "waysted",
  "weapon",
  "weenie",
  "weewee",
  "welcher",
  "welfare",
  "wetb",
  "wetback",
  "wetspot",
  "whacker",
  "whash",
  "whigger",
  "whiskey",
  "whiskeydick",
  "whiskydick",
  "whit",
  "whitenigger",
  "whites",
  "whitetrash",
  "whitey",
  "whiz",
  "whop",
  "whore",
  "whorefucker",
  "whorehouse",
  "wigger",
  "willie",
  "williewanker",
  "willy",
  "wn",
  "wog",
  "women's",
  "wop",
  "wtf",
  "wuss",
  "wuzzie",
  "xtc",
  "xxx",
  "yankee",
  "yellowman",
  "zigabo",
  "zipperhead",
]; // Taken from https://www.cs.cmu.edu/~biglou/resources/bad-words.txt

function containsVulgarWords(text) {
  const lowerCaseText = text.toLowerCase();
  return vulgarWords.some((word) => lowerCaseText.includes(word));
}

function Popup({
  trigger,
  setTrigger,
  editedPost,
  setEditedPost,
  editMode,
  editPost,
  setEditMode,
}) {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [location, setLocation] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (editMode && editedPost.id) {
      setTitle(editedPost.title);
      setPostText(editedPost.postText);
      setDateFrom(editedPost.dateFrom);
      setDateTo(editedPost.dateTo);
      setLocation(editedPost.location);
      setCategory(editedPost.category);
      setImageUrl(editedPost.imageUrl);
    } else {
      // Reset fields when not in edit mode
      setTitle("");
      setPostText("");
      setDateFrom("");
      setDateTo("");
      setLocation("");
      setCategory("");
      setImageUrl(null);
    }
  }, [editMode, editedPost]);

  const handleClosePopup = () => {
    setTrigger(false);
    setEditedPost({
      id: "",
      title: "",
      postText: "",
      dateFrom: "",
      dateTo: "",
      location: "",
      category: "",
      imageUrl: null, // Reset imageUrl as well
    });
    setEditMode(false); // Make sure to reset editMode as well
  };

  const uploadImage = async () => {
    if (imageUpload == null) return;

    const imageRef = ref(storage, `images/${imageUpload.name + uuidv4()}`);
    const snapshot = await uploadBytes(imageRef, imageUpload);
    const imageUrl = await getDownloadURL(snapshot.ref);

    setImageUrl(imageUrl);
    alert("Uploaded an image!");
  };

  const createPost = async () => {
    if (
      containsVulgarWords(postText) ||
      containsVulgarWords(title) ||
      containsVulgarWords(location)
    ) {
      alert("Please avoid using vulgar or offensive words.");
      return;
    }

    const timestamp = serverTimestamp();

    await addDoc(collection(db, "posts"), {
      title,
      postText,
      dateFrom,
      dateTo,
      location,
      imageUrl,
      category,
      author: {
        name: auth.currentUser.displayName,
        id: auth.currentUser.uid,
      },
      timestamp,
    });

    navigate("/");
    setTrigger(false);
    alert("Uploaded an event!");
  };

  const updatePost = async () => {
    // Check if editedPost contains a valid ID
    if (!editedPost.id) {
      console.error("Cannot update post without ID");
      return;
    }

    // Proceed with updating the post
    const postDocRef = doc(db, "posts", editedPost.id);
    await updateDoc(postDocRef, {
      title,
      postText,
      dateFrom,
      dateTo,
      location,
      imageUrl,
      category,
    });

    // Optionally, fetch the updated list of posts
    alert("Updated post!");
  };

  return trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={handleClosePopup}>
          Close
        </button>
        <div className="createPostPage">
          <div className="cpContainer">
            <h1>Event Details</h1>
            <div className="inputGp">
              <label>Title: </label>
              <input
                placeholder="Title..."
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="inputGp">
              <label>From: </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
              />
            </div>
            <div className="inputGp">
              <label>To: </label>
              <input
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
              />
            </div>
            <div className="inputGp">
              <label>Location: </label>
              <textarea
                placeholder="Location..."
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </div>
            <div className="inputGp">
              <label>Post: </label>
              <textarea
                placeholder="Post..."
                value={postText}
                onChange={(event) => setPostText(event.target.value)}
              />
            </div>
            <div className="inputGp">
              <input
                type="file"
                onChange={(event) => setImageUpload(event.target.files[0])}
              />
            </div>
            <div className="inputGp">
              <label>Category: </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="">Select Category</option>
                <option value="fun">Fun</option>
                <option value="technology">Technology</option>
                <option value="art">Art</option>
                <option value="education">Education</option>
                <option value="gaming">Gaming</option>
                <option value="business">Business</option>
                <option value="general science">General Science</option>
                <option value="maths">Maths</option>
              </select>
            </div>
            <div className="inputGp">
              <button onClick={uploadImage}>Upload Image</button>

              {editMode ? (
                <button onClick={updatePost}>Edit Post</button>
              ) : (
                <button onClick={createPost}>Create Post</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default Popup;
