<?php
namespace app\core\widgets\AdvertFullWidget;

use app\core\base\AppWidget;

class AdvertFullWidget extends AppWidget {

    public $links;

    /**
     * Renders the widget.
     */
    public function run(){
        return $this->renderReact([
            'links' => $this->links,
        ]);
    }
}
