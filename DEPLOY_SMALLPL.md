# Wdrozenie na small.pl

Backend jest przygotowany do uruchamiania przez `app.js` i Passengera.

## 1. Przygotuj strone typu Node.js

W panelu `small.pl`:

- dodaj domene,
- dodaj strone WWW typu `Node.js`,
- wybierz wersje `Node.js`,
- katalog projektu ustaw jako `public_nodejs`.

Projekt musi finalnie lezec w katalogu:

`/usr/home/LOGIN/domains/DOMENA/public_nodejs`

## 2. Przygotuj MongoDB

W panelu `MongoDB` utworz baze. Na small.pl:

- uzytkownik bazy ma zwykle taka sama nazwe jak baza,
- host MongoDB zalezy od numeru serwera i ma postac `mongoX.small.pl`.

Przyklad:

- serwer `s12.small.pl` -> host `mongo12.small.pl`

## 3. Ustaw zmienne srodowiskowe

Na `small.pl` Passenger czyta zmienne z `~/.bash_profile`, nie z `.bashrc`.

Dodaj do `~/.bash_profile`:

```bash
export NODE_ENV=production
export JWT_SECRET='wlasny_dlugi_losowy_sekret'
export MONGO_HOST='mongoX.small.pl'
export MONGO_DB='twoja_baza'
export MONGO_USER='twoj_uzytkownik'
export MONGO_PASSWORD='twoje_haslo'
```

Potem zaladuj zmiany:

```bash
source ~/.bash_profile
```

## 4. Wgraj projekt i zainstaluj zaleznosci

W katalogu projektu:

```bash
npm install
```

Jesli chcesz przypiac konkretna wersje Node.js:

```bash
mkdir -p ~/bin
ln -fs /usr/local/bin/node22 ~/bin/node
ln -fs /usr/local/bin/npm22 ~/bin/npm
source ~/.bash_profile
```

## 5. Restart aplikacji

Po zmianach wykonaj restart:

```bash
devil www restart DOMENA
```

Logi bledu znajdziesz w:

`/usr/home/LOGIN/domains/DOMENA/logs/error.log`
