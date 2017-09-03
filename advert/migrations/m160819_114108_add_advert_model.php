<?php

use yii\db\Migration;

class m160819_114108_add_advert_model extends Migration
{
    public function up()
    {
        $this->createTable('advert', [
            'id' => $this->primaryKey(),
            'realtyId' => $this->integer()->notNull(),
            'userUid' => $this->string(36)->notNull(),
            'price' => $this->money(),
            'type' => $this->string(255),
            'createTime' => $this->dateTime()->notNull(),
            'updateTime' => $this->dateTime()->notNull(),
            'viewCount' => $this->integer(),
            'contactName' => $this->string(2000),
            'contactPhone' => $this->string(255),
            'contactEmail' => $this->string(255),
        ]);

        $this->createTable('realty', [
            'id' => $this->primaryKey(),
            'uid' => $this->string(36)->notNull(),
            'address' => $this->string(2000),
            'areaSize' => $this->double('10,2')->comment('Площадь (м2)'),
            'categoryId' => $this->integer(),
            'realtyTypeId' => $this->string(255),
            'roomCount' => $this->integer(),
            'roomType' => $this->string(255),
            'compoundId' => $this->string(255),
            'readiness' => $this->string(255),
            'floor' => $this->string(255),
            'floorTotal' => $this->integer(),
            'renovationId' => $this->string(255),
            'mortgage' => $this->boolean(),
            'platSize' => $this->double('10,2')->comment('Площадь участка'),
            'description' => $this->text(),
        ]);
    }

    public function down()
    {
        $this->dropTable('advert');
        $this->dropTable('realty');
    }

}
