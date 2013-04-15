grep -lr -e 'snowpool.staging' * | xargs sed -i 's/snowpool.staging/snowpool.staging/g'
