function openIndexedDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("PointCloudDatabase", 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;

            //  store yoksa oluştur
            if (!db.objectStoreNames.contains("pointCloudStore")) {
                db.createObjectStore("pointCloudStore", { keyPath: "id" });
            }
        };

        request.onsuccess = function (event) {
            console.log("IndexedDB opened successfully");
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            console.error("Error opening IndexedDB:", event.target.error);
            reject(event.target.error);
        };
    });
}
async function savePointCloudData(id, data) {
    const db = await openIndexedDatabase();
    const transaction = db.transaction("pointCloudStore", "readwrite");
    const store = transaction.objectStore("pointCloudStore");

    const dataToSave = { id: id, pointCloudData: data };

    const request = store.put(dataToSave);

    request.onsuccess = function () {
        console.log("PointCloud2 data saved to IndexedDB successfully");
    };

    request.onerror = function (event) {
        console.error("Error saving data to IndexedDB:", event.target.error);
    };
}
async function getPointCloudData(id) {
    const db = await openIndexedDatabase();
    const transaction = db.transaction("pointCloudStore", "readonly");
    const store = transaction.objectStore("pointCloudStore");

    return new Promise((resolve, reject) => {
        const request = store.get(id);

        request.onsuccess = function () {
            if (request.result) {
                console.log("Retrieved PointCloud2 data from IndexedDB:", JSON.parse(request.result.pointCloudData));
                resolve(JSON.parse(request.result.pointCloudData));  // Başarılıysa result'u döndürüyoruz
            } else {
                console.log("No data found for ID:", id);
                resolve(null);  
            }
        };

        request.onerror = function (event) {
            console.error("Error retrieving data from IndexedDB:", event.target.error);
            reject(event.target.error);  // Hata durumunda reject 
        };
    });
}
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64); 
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer; 
}
function parsePointCloud2Message(message) {
    if (!message || !message.data || !message.fields || !message.point_step) {
        throw new Error("Invalid PointCloud2 message format");
    }
    console.log(scene)
    console.log("Message fields:", message.fields);
    console.log("Data length:", message.data.length);
    console.log("Point step:", message.point_step);
    const rawData = base64ToArrayBuffer(message.data);
    console.log("raw=>",rawData)
    const points = [];
    const dataView = new DataView(rawData);
    const pointStep = message.point_step;
    const numPoints = message.width * message.height   // Math.min(message.width * message.height, 10000000);

    const xOffset = message.fields.find(f => f.name === 'x')?.offset;
    const yOffset = message.fields.find(f => f.name === 'y')?.offset;
    const zOffset = message.fields.find(f => f.name === 'z')?.offset;

    if (xOffset === undefined || yOffset === undefined || zOffset === undefined) {
        throw new Error("x, y, or z offset not found in fields");
    }

    console.log(`NumPoints: ${numPoints}, xOffset: ${xOffset}, yOffset: ${yOffset}, zOffset: ${zOffset}`);

    const offset = 0; // İlk iterasyon
    const maxOffset = offset + Math.max(xOffset, yOffset, zOffset) + 4;
    console.log("Raw data type:", typeof message.data);
    console.log("Raw data instance:", message.data instanceof Uint8Array);
    console.log("Raw data example:", message.data.slice(0, 20)); // İlk 20 byte


    if (maxOffset > message.data.length) {
        console.error(`Initial offset exceeds data length: maxOffset = ${maxOffset}, data length = ${message.data.length}`);
    } else {
        console.log(`Initial offset is valid: maxOffset = ${maxOffset}, data length = ${message.data.length}`);
    }
    const xLittleEndian = dataView.getFloat32(offset + xOffset, true);  // Küçük endian
    const xBigEndian = dataView.getFloat32(offset + xOffset, false);  // Büyük endian

    console.log(`x (Little Endian): ${xLittleEndian}, x (Big Endian): ${xBigEndian}`);
    for (let i = 0; i < numPoints; i++) {
        const offset = i * pointStep;
        const maxOffset = offset + Math.max(xOffset, yOffset, zOffset) + 4; // Float32 için 4 byte
        if (maxOffset > message.data.length) {
            console.log(`Invalid offset: ${maxOffset} exceeds data length: ${message.data.length}`);
            break; // Döngüyü kır
        }

        try {
            const x = dataView.getFloat32(offset + xOffset, !message.is_bigendian);
            const y = dataView.getFloat32(offset + yOffset, !message.is_bigendian);
            const z = dataView.getFloat32(offset + zOffset, !message.is_bigendian);

            points.push({ x, y, z });
        } catch (error) {
            console.log(`Error reading point at index ${i}:`, error);
            break; // Hata durumunda döngüyü kır
        }
    }

    console.log("Parsed points:", points.length);
    return points;
}
function createPointCloud(points) {
    console.log("pointsim=>", points);
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 3); // RGB için

    let minZ = Infinity, maxZ = -Infinity;

    // Min ve max Z değerlerini bul
    for (let i = 0; i < points.length; i++) {
        if (points[i].z < minZ) minZ = points[i].z;
        if (points[i].z > maxZ) maxZ = points[i].z;
    }

    for (let i = 0; i < points.length; i++) {
        const z = points[i].z;
        positions[i * 3] = points[i].x;
        positions[i * 3 + 1] = points[i].y;
        positions[i * 3 + 2] = z;

        let normalizedZ = (z - minZ) / (maxZ - minZ);
        normalizedZ = Math.pow(normalizedZ, 0.2); // Buradaki üssü küçülterek geçişi hızlandır

     
        let r = Math.max(1 - normalizedZ * 2, 0);
        let g = Math.max(1 - Math.abs(normalizedZ * 2 - 1), 0);
        let b = Math.max((normalizedZ - 0.5) * 2, 0);

        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); // Renk verisini ekle

    const material = new THREE.PointsMaterial({
        vertexColors: true, // Renkleri noktaya uygula
        size: 0.3
    });

    return new THREE.Points(geometry, material);
}



$(document).ready(function () {
console.log("ros=>", ros);
                        
    var globalMapTopic = new ROSLIB.Topic({
        ros: ros, 
        name: '/globalmap', 
        messageType: 'sensor_msgs/PointCloud2' 
    });
    console.log(globalMapTopic)
    globalMapTopic.subscribe(function (message) {
        console.log("PointCloud2 data received:", message);
    try {
            const pointCloudData = JSON.stringify(message); 
        savePointCloudData("pointCloud2", pointCloudData); 
    } catch (error) {
        console.error("Error saving PointCloud2 data:", error);
    }
    });
});