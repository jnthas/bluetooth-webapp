#/bin/bash

echo "Removing all cached bluetooth devices. Are you sure?"
read -p "Press any key to continue"

pkill chrome
sudo rm -rf /var/lib/bluetooth/*
sudo systemctl restart bluetooth
