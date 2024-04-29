/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef} from 'react';
import {
  Dimensions,
  ImageBackground,
  Image as RNimage,
  StyleSheet,
  View,
} from 'react-native';
import Canvas, {Image as CanvasImage} from 'react-native-canvas';
import data from './data.json';

let ImageWidth = 200;
let ImageHeight = 200;

let FrameWidth = ImageWidth * 1.15;
let FrameHeight = ImageHeight * 1.15;

// Get device screen dimensions
const {width, height} = Dimensions.get('window');

// Define image sizes and spacing
const imageSize = 200; // Example image size
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

const CanvasImageDisplay = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const drawCanvas = (canvas: any) => {
      if (!canvas) {
        return;
      }

      const context = canvas.getContext('2d');
      context.fillStyle = 'purple';

      // Set the canvas dimensions based on the frame size
      canvas.width = data.frame.width + 400;
      canvas.height = data.frame.height + 400;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the images with frames
      const images = [...data.images]; // Copy the array to avoid mutating the original data
      images.reverse(); // Reverse the array to draw the first image on top

      console.log('images', images);
      // Draw the images with frames
      images.forEach((imageData: any) => {
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

      const frameImage = new CanvasImage(canvas);
      frameImage.src = require('./Assets/frame_2.png'); // Replace 'path_to_frame_image' with the path to your frame image

      // Draw the images with frames
      images.forEach((imageData: any) => {
        const image = new CanvasImage(canvas);
        image.src = imageData.Frame;

        image.addEventListener('load', () => {
          context.fillStyle = 'purple';

          context.save(); // Save the current context state
          context.translate(
            imageData.x + FrameWidth / 2.15,
            imageData.y + FrameHeight / 2.405,
          ); // Translate to the center of the image
          context.rotate((imageData.rotation * Math.PI) / 178); // Rotate the image
          context.resizeMode = 'cover';
          context.drawImage(
            image,
            -FrameWidth / 2,
            -FrameHeight / 2,
            FrameWidth,
            FrameHeight,
          );
          context.restore(); // Restore the context to its original state
        });
      });
    };

    drawCanvas(canvasRef.current);
  }, []);

  return (
    <ImageBackground
      source={require('./Assets/Background.png')}
      style={{flex: 1, width: '100%', height: '100%'}}>
      <View style={styles.canvasContainer}>
        <Canvas ref={canvasRef} style={styles.canvas} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    // zIndex: 9999,
  },
  canvas: {
    flex: 1,
    // zIndex: 9999,
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

export default CanvasImageDisplay;
