
echo "Generating env.js file..."

cat << EOF > env.js
window.env = {
    HOST_ADDRESS: "$HOST_ADDRESS",
    USERMGR_PORT: "$USERMGR_PORT",
    AUTH_PORT: "$AUTH_PORT",
    GAME_PORT: "$GAME_PORT",
    CHAT_PORT: "$CHAT_PORT",
}
EOF

cp -p env.js ./static/js/env.js

if [ -f ./static/js/env.js ]; then
    echo "env.js file generated successfully!"
    cat ./static/js/env.js
else
    echo "Failed to generate env.js file!"
fi