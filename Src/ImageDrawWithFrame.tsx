import React, {useEffect, useRef} from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Canvas, {Image as CanvasImage} from 'react-native-canvas';
import data from '../data.json';

let ImageWidth = 150;
let ImageHeight = 150;

// Get device screen dimensions
const {width, height} = Dimensions.get('window');

// Define image sizes and spacing
const imageSize = 130; // Example image size
const spacing = 30; // Example spacing between images

// Calculate maximum total x and y coordinates
const maxImagesPerRow = Math.floor((width - spacing) / (imageSize + spacing)); // Maximum number of images per row
const maxImagesPerColumn = Math.floor(
  (height - spacing) / (imageSize + spacing),
); // Maximum number of images per column
const maxX = maxImagesPerRow * (imageSize + spacing) - spacing; // Maximum total x coordinate
const maxY = maxImagesPerColumn * (imageSize + spacing) - spacing; // Maximum total y coordinate

console.log('Max X Coordinate:', maxX);
console.log('Max Y Coordinate:', maxY);

const ImageDrawWithFrame = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const drawCanvas = (canvas: any) => {
      if (!canvas) {
        return;
      }

      const context = canvas.getContext('2d');

      // Set the canvas dimensions based on the frame size
      canvas.width = data.frame.width;
      canvas.height = data.frame.height;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the images with frames
      data.images.forEach((imageData: any) => {
        // Draw frame
        context.fillStyle = 'blue';
        context.fillRect(
          imageData.x - 5,
          imageData.y - 5,
          ImageWidth + 10,
          ImageHeight + 10,
        );
        context.rotate((imageData.rotation * Math.PI) / 180);
        // Draw the image
        const image = new CanvasImage(canvas);
        image.src = imageData.src;

        image.addEventListener('load', () => {
          context.save(); // Save the current context state
          context.translate(
            imageData.x + ImageWidth / 2,
            imageData.y + ImageHeight / 2,
          ); // Translate to the center of the image
          context.rotate((imageData.rotation * Math.PI) / 180); // Rotate the image
          context.drawImage(
            image,
            -ImageWidth / 2,
            -ImageHeight / 2,
            ImageWidth,
            ImageHeight,
          );
          context.restore(); // Restore the context to its original state
        });
      });
    };

    drawCanvas(canvasRef.current);
  }, []);

  const handleCanvasClick = event => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;

    console.log('Clicked at:', x, y);

    data.images.forEach(imageData => {
      if (
        x >= imageData.x &&
        x <= imageData.x + 100 &&
        y >= imageData.y &&
        y <= imageData.y + 100
      ) {
        Alert.alert('Image Clicked', imageData.src);
      }
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../Assets//Background.png')}
        style={{flex: 1, width: '100%', height: '100%'}}>
        <TouchableOpacity
          onPress={handleCanvasClick}
          style={styles.canvasContainer}>
          <Canvas ref={canvasRef} style={styles.canvas} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default ImageDrawWithFrame;
