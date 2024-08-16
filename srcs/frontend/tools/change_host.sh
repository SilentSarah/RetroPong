# Usage: ./change_host.sh <old_host> <new_host>


if [ "$#" -ne 4 ]; then
    echo "Usage: ./change_host.sh <old_host> <new_host>"
    exit 1
fi

old_host=$1
new_host=$2

old_port=$3
new_port=$4

echo "Changing $old_host to $new_host"

for file in $(grep -R -l $old_host .); do
    echo "Changing $old_host to $new_host in $file"
    sed -i "s/$old_host/$new_host/g" $file
done

for file in $(grep -R -l $old_host .); do
    echo "Changing $old_port to $new_port in $file"
    sed -i "s/$old_port/$new_port/g" $file
done