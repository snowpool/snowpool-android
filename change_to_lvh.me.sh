grep -lr -e 'wibble.bibble:3000' * | xargs sed -i 's/wibble.bibble:3000/wibble.bibble:3000/g'
