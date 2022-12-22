import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="250"
        image={product.image}
      />
      <CardContent>
        <Typography>{product.name}</Typography>
        <Typography sx={{ fontWeight: 'bold' }}>${product.cost}</Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions className="card-actions">
        <Button className="card-button" name="add to cart" fullWidth startIcon={<AddShoppingCartOutlined />} 
        variant="contained" size="medium" onClick={handleAddToCart}>ADD TO CART</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
