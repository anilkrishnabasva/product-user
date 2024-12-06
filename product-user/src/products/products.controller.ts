import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { Product } from "./product.entity";
import { ProductsService } from "./products.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from 'src/auth/roles.decorator';

@Controller('products') // Base route for this controller
@UseGuards(JwtAuthGuard, RolesGuard) // Apply authentication guard to all routes 
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {} // Inject service

    /**
     * This method is used to create new product
     * @Body() decorator is used to extract data from the body of an incoming HTTP request. It is commonly used in route handlers within controllers to obtain the data sent by a client.
     * @param product contains new product data
     */
    @Post() // Handle POST requests for creating a product
    @Roles('admin')
    async create(@Body() product: Product): Promise<Product> {
        return this.productsService.create(product);
    }

    /**
     * @Query() decorator is used to extract query parameters from the URL of an incoming HTTP request.
     * Query parameters are often used to send additional information to the server that can be optional or 
     * used for filtering, sorting, pagination, or any custom request modification.
     * /users?role=admin&age=30, the query object will be { role: 'admin', age: '30' }.
     */
    @Get() // Handle GET requests to retrieve all products
    @Roles('admin', 'customer')
    async findAll(@Query('isActive') isActive: boolean): Promise<Product[]> {
        return this.productsService.findAll(isActive);
    }

    /**
     * @Param() decorator is used to extract route parameters from the URL of an incoming HTTP request
     * /users/5/products/10, the params object would be { userId: '5', productId: '10' }
     * @param id id value in URL path
     */
    @Get(':id') // Handle GET requests for a specific product by ID
    @Roles('admin', 'customer')
    async findOne(@Param('id') id: number): Promise<Product> {
        return this.productsService.findOne(id);
    }

    @Put(':id') // Handle PUT requests to update a product
    @Roles('admin')
    async update(@Param('id') id: number, @Body() product: Product): Promise<Product> {
        return this.productsService.update(id, product);
    }

    @Patch(':id/price') // Handle PATCH requests to update product price
    @Roles('admin')
    async updatePrice(@Param('id') id: number, @Body('price') price: number): Promise<Product> {
        return this.productsService.updatePrice(id, price);
    }

    @Patch(':id/price-drop') // Handle PATCH requests to apply price drop
    @Roles('admin')
    async applyPriceDrop(@Param('id') id: number, @Body('discount') discount: number): Promise<Product> {
        return this.productsService.applyPriceDrop(id, discount);
    }

    @Patch(':id/availability') // Handle PATCH requests to update availability
    @Roles('admin')
    async updateAvailability(@Param('id') id: number, @Body('isAvailable') isAvaiable: boolean): Promise<Product> {
        return this.productsService.updateAvailability(id, isAvaiable);
    }

    @Get(':id/recommendations') // Handle GET requests for product recommendations
    @Roles('admin', 'customer')
    async getRecommendations(@Param('id') id: number): Promise<Product[]> {
        return this.productsService.getRecommendations(id);
    }

    @Delete(':id') // Handle DELETE requests to remove a product
    @Roles('admin')
    async remove(@Param('id') id:number): Promise<void> {
        return this.productsService.remove(id);
    }
}